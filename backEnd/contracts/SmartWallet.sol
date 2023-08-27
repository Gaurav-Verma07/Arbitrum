// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";
import {ERC20} from "solmate/src/tokens/ERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ECDSA, SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

contract SmartWallet is
    Initializable,
    IERC721Receiver,
    IERC1155Receiver,
    IERC777Recipient
{
    error InvalidOwner();
    error InvalidEntryPointOrOwner();
    error InvalidSignature();
    error InvalidUpgradeDelay();
    error ZeroAddress();
    error InvalidRescue();
    error Duplicate();
    error LengthMismatchError();
    error InvalidThreshold();

    struct UserOperation {
        address sender;
        uint256 nonce;
        bytes initCode;
        bytes callData;
        uint256 callGasLimit;
        uint256 verificationGasLimit;
        uint256 preVerificationGas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
        bytes paymasterAndData;
        bytes signature;
    }

    struct dataOfUser {
        address owner;
        address entryPoint;
        uint96 nonce;
        uint256 upgradeDelay;
    }
    dataOfUser public userData;

    struct DataOfRecovery {
        uint16 threshold;
        address[] recoveryWallets;
        mapping(address => bool) isRecoveryWallet;
    }
    DataOfRecovery public dataOfRecovery;

    constructor() {
        _disableInitializers();
        // solhint-disable-previous-line no-empty-blocks
    }

    function addRescueWallet(
        address[] calldata _recoveryWallets,
        uint16 threshold
    ) external onlyOwner {
        require(threshold > 0, "Threshold must be greater than zero");
        require(_recoveryWallets.length >= threshold, "Invalid threshold");

        for (uint256 i; i < _recoveryWallets.length; i++) {
            address rescue = _recoveryWallets[i];
            if (rescue == address(0)) revert ZeroAddress();
            if (dataOfRecovery.isRecoveryWallet[rescue]) revert Duplicate();
            dataOfRecovery.isRecoveryWallet[rescue] = true;
            dataOfRecovery.recoveryWallets.push(rescue);
        }
    }

    function revokeRescueWallet(
        address _recoveryWallet,
        uint16 threshold
    ) external onlyOwner {
        if (!dataOfRecovery.isRecoveryWallet[_recoveryWallet])
            revert InvalidRescue();
        address[] storage rescueWallet = dataOfRecovery.recoveryWallets;
        uint256 rescueIn = rescueWallet.length;
        if (threshold > rescueIn - 1) revert InvalidThreshold();
        uint256 index;
        for (uint256 i; i < rescueIn; i++) {
            if (rescueWallet[i] == _recoveryWallet) {
                index = i;
                break;
            }
        }
        if (index != rescueIn - 1) {
            rescueWallet[index] = rescueWallet[rescueIn - 1];
            rescueWallet.pop();
        } else {
            rescueWallet.pop();
        }
    }

    function initialize(
        address _entryPoint,
        address _owner,
        uint32 _upgradeDelay
    ) public initializer {
        if (_entryPoint == address(0) || _owner == address(0)) {
            revert ZeroAddress();
        }

        userData.entryPoint = _entryPoint;
        userData.owner = _owner;

        if (_upgradeDelay < 1 days) revert InvalidUpgradeDelay();
        userData.upgradeDelay = _upgradeDelay;
    }

    function transferERC20(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        SafeTransferLib.safeTransfer(ERC20(token), to, amount);
    }

    function transferETH(
        address payable to,
        uint256 amount
    ) external onlyOwner {
        SafeTransferLib.safeTransferETH(to, amount);
    }

    function transferERC721(
        address collection,
        uint256 tokenId,
        address to
    ) external onlyOwner {
        IERC721(collection).safeTransferFrom(address(this), to, tokenId);
    }

    function transferERC1155(
        address collection,
        uint256 tokenId,
        address to,
        uint256 amount
    ) external onlyOwner {
        IERC1155(collection).safeTransferFrom(
            address(this),
            to,
            tokenId,
            amount,
            ""
        );
    }

    function setEntryPointAdress(
        address _newEntryPointAddress
    ) external onlyOwner {
        if (_newEntryPointAddress == address(0)) revert ZeroAddress();

        userData.entryPoint = _newEntryPointAddress;
    }

    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data
    ) external onlyEntryPointOrOwner {
        _rawCall(_target, _value, _data);
    }

    function executeBatch(
        address[] calldata _target,
        uint256[] calldata _value,
        bytes[] calldata _data
    ) external onlyEntryPointOrOwner {
        if (_target.length != _data.length || _data.length != _value.length)
            revert LengthMismatchError();
        for (uint256 i; i < _target.length; ) {
            _rawCall(_target[i], _value[i], _data[i]);
            unchecked {
                i++;
            }
        }
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        userData.owner = newOwner;
    }

    function validateUserOps(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingWalletFunds
    ) external onlyEntryPointOrOwner returns (uint256 deadline) {
        _validateSignature(userOp, userOpHash);

        if (userOp.initCode.length == 0) {
            require(userData.nonce++ == userOp.nonce, "Invalid nonce");
        }

        depositEntryPointContract(missingWalletFunds);
        return 0;
    }

    function getDeposite() public view returns (uint256) {
        address entryPointAddress = userData.entryPoint;

        bytes4 selector = bytes4(keccak256("balanceOf(address)"));

        (bool success, bytes memory data) = entryPointAddress.staticcall(
            abi.encodeWithSelector(selector, address(this))
        );

        if (success && data.length >= 32) {
            return abi.decode(data, (uint256));
        } else {
            // Handle the case where the static call was not successful
            revert("Static call failed");
        }
    }

    function addDeposite() public payable {
        (bool success, bytes memory data) = address(userData.entryPoint).call{
            value: msg.value
        }(abi.encodeWithSignature("depositTo(address)", address(this)));
        if (!success) {
            assembly {
                revert(add(data, 32), mload(data))
            }
        }
    }

    function withdrawDepositeTo(
        address payable to,
        uint256 amount
    ) public onlyOwner {
        (bool success, ) = address(userData.entryPoint).call(
            abi.encodeWithSignature("withdrawTo(address,uint256)", to, amount)
        );

        require(success, "External call failed");
    }

    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view {
        bytes32 messageHash = ECDSA.toEthSignedMessageHash(userOpHash);
        address signer = ECDSA.recover(messageHash, userOp.signature);
        if (signer != owner()) revert InvalidSignature();
    }

    function depositEntryPointContract(uint256 amount) internal {
        if (amount == 0) {
            return;
        }

        (bool success, ) = payable(address(userData.entryPoint)).call{
            value: amount
        }("");
        require(success, "payment failed");
    }

    function _rawCall(
        address target,
        uint256 value,
        bytes memory data
    ) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function _authorizeUpgrade(address) internal onlyOwner {}

    function isValidSignature(
        bytes32 hash,
        bytes memory signature
    ) public view returns (bytes4 zero) {
        return
            ECDSA.recover(hash, signature) == owner()
                ? this.isValidSignature.selector
                : bytes4(0);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return 0x150b7a02;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return 0xf23a6e61;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        return 0xbc197c81;
    }

    function tokensReceived(
        address,
        address,
        address,
        uint256,
        bytes calldata,
        bytes calldata
    ) external pure override {}

    function supportsInterface(
        bytes4 interfaceId
    ) external view virtual override returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId;
    }

    function entryPoint() public view returns (address) {
        return userData.entryPoint;
    }

    modifier onlyOwner() {
        if (msg.sender != owner() && msg.sender != address(this)) {
            revert InvalidOwner();
        }
        _;
    }

    modifier onlyEntryPointOrOwner() {
        if (
            msg.sender != address(entryPoint()) &&
            msg.sender != owner() &&
            msg.sender != address(this)
        ) {
            revert InvalidEntryPointOrOwner();
        }
        _;
    }

    function nonce() public view returns (uint96) {
        return userData.nonce;
    }

    function owner() public view returns (address) {
        return userData.owner;
    }

    receive() external payable {}
}
