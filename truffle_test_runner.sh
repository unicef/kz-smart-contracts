# Tests have to be executed separately due to https://github.com/ethereumjs/testrpc/issues/346
truffle compile
run-with-testrpc -d 'truffle test test/javascript/testMultiSigWallet.js'
run-with-testrpc -d 'truffle test test/javascript/testMultiSigWalletCancel.js'
