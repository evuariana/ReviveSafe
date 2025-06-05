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
        allMultiSigs.push(multisig);

        // Emit for indexing/logs
        emit MultiSigCreated(msg.sender, multisig, owners, required);
    }

    /// @notice Register a previously deployed multisig address.
    /// @param multisig The address of the multisig to register.
    function registerExistingMultisig(address multisig) external {
        require(multisig != address(0), "Invalid multisig address");
        // Optionally, check that the address is a contract and supports isOwner(address).
        // Try to call isOwner(address(this)) to verify.
        bool success = false;
        try MultiSigWallet(payable(multisig)).isOwner(address(this)) returns (bool) {
            success = true;
        } catch {
            success = false;
        }
        require(success, "Not a valid MultiSigWallet");
        allMultiSigs.push(multisig);
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
            // Interface‐call to the deployed MultiSigWallet
            MultiSigWallet candidate = MultiSigWallet(payable(allMultiSigs[i]));
            if (candidate.isOwner(owner)) {
                count++;
            }
        }

        // Allocate a fixed‐size array, then populate
        myMultisigs = new address[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < total; i++) {
            MultiSigWallet candidate = MultiSigWallet(payable(allMultiSigs[i]));
            if (candidate.isOwner(owner)) {
                myMultisigs[idx] = allMultiSigs[i];
                idx++;
            }
        }
        return myMultisigs;
    }
}