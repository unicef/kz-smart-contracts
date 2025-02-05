pragma solidity ^0.4.15;
import "./Factory.sol";
import "./MultiSigWallet.sol";


/// @title Multisignature wallet factory - Allows creation of multisig wallet.

contract MultiSigWalletFactory is Factory {

    /*
     * Public functions
     */
    /// @dev Allows verified creation of multisignature wallet.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    /// @return Returns wallet address.
    function create(address _token, address[] _owners, uint _required)
        public
        returns (address wallet)
    {
        wallet = new MultiSigWallet(_token, _owners, _required);
        register(wallet);
    }
}
