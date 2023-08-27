// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract SmartWalletProxy {
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
    bytes32 internal constant _OWNER_SLOT =
        0xb4a99a4e5a74f060473043af6591d7f041a3456d30592a5704829761f2eecca5;

    constructor(
        address logic,
        bytes memory data,
        address _walletOwner
    ) payable {
        _initialize(logic, data);
        assembly {
            sstore(_OWNER_SLOT, _walletOwner)
        }
    }

    modifier onlyOwner() {
        require(msg.sender == getOwner());
        _;
    }

    function getOwner() public view returns (address ownerAddress) {
        assembly {
            ownerAddress := sload(_OWNER_SLOT)
        }
        console.log("ownerAddress: %s", ownerAddress);
    }

    function _initialize(
        address newImplementation,
        bytes memory data
    ) internal {
        _setImplementation(newImplementation);
        Address.functionDelegateCall(newImplementation, data);
    }

    function _setImplementation(address newImplementation) private {
        require(Address.isContract(newImplementation));
        assembly {
            sstore(_IMPLEMENTATION_SLOT, newImplementation)
        }
    }

    function upgradeTo(address newImplementation) external onlyOwner {
        _setImplementation(newImplementation);
    }

    function getImplementation() public view returns (address implementation) {
        assembly {
            implementation := sload(_IMPLEMENTATION_SLOT)
        }
        console.log("implementation: %s", implementation);
    }

    /**
     * @dev Delegates the current call to `implementation`.
     *
     * This function does not return to its internal call site, it will return directly to the external caller.
     */
    function _delegate(address implementation) private {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function _fallback() internal {
        _delegate(getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }
}
