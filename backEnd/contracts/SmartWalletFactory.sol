// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import {SmartWallet} from "./SmartWallet.sol";
import {SmartWalletProxy} from "./SmartWalletProxy.sol";

contract SmartWalletFactory is Ownable {
    address public immutable walletLogic;
    event SmartWalletProxyAdress(address indexed walletProxy);

    constructor(bytes32 _salt) Ownable() {
        walletLogic = deployImplementation(_salt);
    }

    // Deploy smart wallet implementation using CREATE2
    function deployImplementation(
        bytes32 salt
    ) internal returns (address _walletLogic) {
        bytes memory deploymentData = abi.encodePacked(
            type(SmartWallet).creationCode
        );

        _walletLogic = Create2.deploy(0, salt, deploymentData);
    }

    function createSmartWallet(
        address entryPoint,
        address walletOwner,
        uint32 upgradeDelay
    ) external returns (address) {
        bytes32 salt = keccak256(abi.encode(walletOwner));
        SmartWalletProxy wallet = new SmartWalletProxy{salt: bytes32(salt)}(
            walletLogic,
            abi.encodeCall(
                SmartWallet.initialize,
                (entryPoint, walletOwner, upgradeDelay)
            ),
            walletOwner
        );
        emit SmartWalletProxyAdress(address(wallet));
        return address(wallet);
    }

    function getWalletAddress(
        address entryPoint,
        address walletOwner,
        uint32 upgradeDelay
    ) public view returns (address) {
        bytes32 salt = keccak256(abi.encode(walletOwner));
        bytes memory deploymentData = abi.encodePacked(
            type(SmartWalletProxy).creationCode,
            abi.encode(
                walletLogic,
                abi.encodeCall(
                    SmartWallet.initialize,
                    (entryPoint, walletOwner, upgradeDelay)
                ),
                walletOwner
            )
        );

        return Create2.computeAddress(bytes32(salt), keccak256(deploymentData));
    }

    // function to return creation code of smart wallet implementation
    function getCreationCode() public pure returns (bytes memory) {
        return type(SmartWallet).creationCode;
    }
}
