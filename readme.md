Ethereum Multisignature Wallet based on Gnosis MultiSigWallet samples.



Deploy:
truffle compile
truffle migrate <account1,account2,...,accountN> <requiredConfirmations>

truffle migrate 0xaed58811d50a0556c0d853108c88da494f1efe8e,0x647bfd06b0e9943d054287aedc7235e6f75e50b7 2



For redeploy:
truffle migrate --reset


Run contract tests:
npm test

Run Mocha test in truffle:
1) Before need run "ganache-cli"
2) truffle console
3) test ./test/javascript/testMultiSigWallet.js


Call contract function:
truffle> var multisigInstance = await MultiSigWallet.new(tokenInstance.address, [accounts[0], accounts[1]], requiredConfirmations);
truffle> await multisigInstance.confirmTransaction(transactionId, accounts[2], {from: accounts[1]});

-------------
Step-by-step confirmation scheme:
1. Deploy contract
MultiSigWallet.new(tokenInstance.address, [accounts[0], accounts[1]], requiredConfirmations)
 create transaction and atokens in contract
multisigInstance.submitTransaction(accounts[3], deposit, '0x0123', {from: accounts[0]});
2. Confirmation by owner
multisigInstance.confirmTransaction(transactionId, nextAccount, {from: accounts[1]});
3. next account confirmation and next confirmation ...
4. last confirmation
multisigInstance.confirmTransaction(transactionId, zeroAccount, {from: accounts[2]});
5. Complete. Token send. Contract end.

Or cancel scheme:
4. Owner cancel confirmation
multisigInstance.cancelfirmation({from: accounts[1]});
5. Contract end. Transaction destroyed. Token destroyed.







Function list:

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return Returns transaction ID.
    function submitTransaction(address destination, uint value, bytes data)

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    /// @param newOwner next owner to confirmation.
    function confirmTransaction(uint transactionId, address newOwner)

    /// @dev Allows an owner to cancel a confirmation and destroy contract
    function cancelfirmation()

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint transactionId)


    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Number of confirmations.
    function getConfirmationCount(uint transactionId)

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Total number of transactions after filters are applied.
    function getTransactionCount(bool pending, bool executed)

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    function getOwners()

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return Returns array of owner addresses.
    function getConfirmations(uint transactionId)

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Returns array of transaction IDs.
    function getTransactionIds(uint from, uint to, bool pending, bool executed)



