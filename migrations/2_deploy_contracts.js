const MultisigWalletFactory = artifacts.require('MultiSigWalletFactory.sol')

module.exports = deployer => {
  const args = process.argv.slice()
  if (process.env.DEPLOY_FACTORY){
    deployer.deploy(MultisigWalletFactory)
    console.log("Factory with Daily Limit deployed")
  } else {
    console.error("Multisig with daily limit requires to pass owner list, required confirmations")
  }
}
