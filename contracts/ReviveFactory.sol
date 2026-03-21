// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ReviveMultisig.sol";

/// @title  MultiSigFactory
/// @notice A minimal factory that deploys new MultiSigWallets and keeps an on‐chain registry.
/// @dev    Anyone can call createMultiSig; all addresses are stored in `allMultiSigs`.
contract MultiSigFactory {
    /// @notice Emitted when a new MultiSigWallet is created.
    /// @param creator    The address that called createMultiSig.
    /// @param multisig   The newly deployed MultiSigWallet address.
    /// @param owners     The list of owners for this new multisig.
    /// @param required   The number of confirmations required.
    event MultiSigCreated(
        address indexed creator,
        address indexed multisig,
        address[] owners,
        uint256 required
    );

    /// @dev All multisig addresses deployed by this factory.
    address[] public allMultiSigs;
    mapping(address => bool) public isRegistered;

    /// @notice Emitted when an existing MultiSigWallet is registered.
    /// @param registrant The address that called registerExistingMultisig.
    /// @param multisig   The multisig address being registered.
    event MultiSigRegistered(address indexed registrant, address indexed multisig);

    /// @notice Deploy a new MultiSigWallet and register its address.
    /// @param owners    An array of owner addresses for the multisig.
    /// @param required  The number of confirmations required (must be >0 and <= owners.length).
    /// @return multisig The address of the newly deployed MultiSigWallet.
    function createMultiSig(address[] memory owners, uint256 required)
        external
        returns (address multisig)
    {
        // Deploy the MultiSigWallet with the given owners and required threshold.
        // The constructor in MultiSigWallet will revert if `owners` or `required` are invalid.
        MultiSigWallet wallet = new MultiSigWallet(owners, required);
        multisig = address(wallet);

        // Register it on‐chain
        _registerMultisig(multisig);

        // Emit for indexing/logs
        emit MultiSigCreated(msg.sender, multisig, owners, required);
    }

    /// @notice Register a previously deployed multisig address.
    /// @param multisig The address of the multisig to register.
    function registerExistingMultisig(address multisig) external {
        require(multisig != address(0), "Invalid multisig address");
        require(_hasCompatibleWalletSurface(multisig), "Not a valid MultiSigWallet");
        _registerMultisig(multisig);
        emit MultiSigRegistered(msg.sender, multisig);
    }

    /// @notice Returns the total list of multisig addresses ever created by this factory.
    /// @return An array of addresses for all multisigs.
    function getAllMultiSigs() external view returns (address[] memory) {
        return allMultiSigs;
    }

    /// @notice Returns only those multisigs where `owner` is in the owners[] array.
    /// @param owner The address to filter for.
    /// @return myMultisigs An array of multisig addresses for which `isOwner(owner) == true`.
    function getMyMultiSigs(address owner)
        external
        view
        returns (address[] memory myMultisigs)
    {
        uint256 total = allMultiSigs.length;
        // First pass: count how many match so we can allocate the result array
        uint256 count = 0;
        for (uint256 i = 0; i < total; i++) {
            if (_isOwnerSafe(allMultiSigs[i], owner)) {
                count++;
            }
        }

        // Allocate a fixed‐size array, then populate
        myMultisigs = new address[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < total; i++) {
            if (_isOwnerSafe(allMultiSigs[i], owner)) {
                myMultisigs[idx] = allMultiSigs[i];
                idx++;
            }
        }
        return myMultisigs;
    }

    function _hasCompatibleWalletSurface(address multisig)
        internal
        view
        returns (bool)
    {
        MultiSigWallet candidate = MultiSigWallet(payable(multisig));
        address[] memory owners;
        uint256 required;

        try candidate.walletCoreVersion() returns (uint32 version) {
            if (version < 2) {
                return false;
            }
        } catch {
            return false;
        }

        try candidate.getOwners() returns (address[] memory returnedOwners) {
            owners = returnedOwners;
        } catch {
            return false;
        }

        if (owners.length == 0) {
            return false;
        }

        try candidate.required() returns (uint256 returnedRequired) {
            required = returnedRequired;
        } catch {
            return false;
        }

        if (required == 0 || required > owners.length) {
            return false;
        }

        try candidate.isOwner(owners[0]) returns (bool listedOwner) {
            if (!listedOwner) {
                return false;
            }
        } catch {
            return false;
        }

        try candidate.transactionCount() returns (uint256) {
        } catch {
            return false;
        }

        try candidate.getTransactionCount(true, false) returns (uint256) {
        } catch {
            return false;
        }

        try candidate.getTransactionIds(0, 0, true, false) returns (uint256[] memory) {
        } catch {
            return false;
        }

        try candidate.getConfirmations(0) returns (address[] memory) {
        } catch {
            return false;
        }

        try candidate.canConfirmTransaction(0, owners[0]) returns (bool) {
        } catch {
            return false;
        }

        try candidate.canExecuteTransaction(0, owners[0]) returns (bool) {
        } catch {
            return false;
        }

        return true;
    }

    function _isOwnerSafe(address multisig, address owner)
        internal
        view
        returns (bool)
    {
        try MultiSigWallet(payable(multisig)).isOwner(owner) returns (bool ownerMatch) {
            return ownerMatch;
        } catch {
            return false;
        }
    }

    function _registerMultisig(address multisig) internal {
        require(!isRegistered[multisig], "Already registered");
        isRegistered[multisig] = true;
        allMultiSigs.push(multisig);
    }
}
