const MultiSigWallet = artifacts.require('MultiSigWallet')
const web3 = MultiSigWallet.web3
const DigicusToken = artifacts.require('DigicusToken')
const utils = require('./utils')


const deployToken = () => {
	return DigicusToken.new()
}


contract('MultiSigWallet', (accounts) => {

	let tokenInstance;
	let multisigInstance;
	let transaction;
	let transactionId;
	let transaction2;
	let transaction2Id;
	const requiredConfirmations = 2
	let deposit = 5;
	let depositToken = 25;
	let balances = [];
	let balancesToken = [];
	let adrZero = "0x0000000000000000000000000000000000000000";


    before('deploy', async function () {
		tokenInstance = await deployToken();
		assert.ok(tokenInstance);
		console.log('tokenInstance', tokenInstance.address);

    })


    it('multisigInstance', async function () {
		multisigInstance = await MultiSigWallet.new(tokenInstance.address, [accounts[0], accounts[1]], requiredConfirmations);
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		console.log('multisigInstance', multisigInstance.address, a.toNumber() );
		assert.ok(multisigInstance);

    })

	// sample of cancel contract
    it('multisigInstance2', async function () {
		multisigInstance = await MultiSigWallet.new(tokenInstance.address, [accounts[0], accounts[1]], requiredConfirmations);
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		console.log('multisigInstance2', multisigInstance.address, a.toNumber() );
		assert.ok(multisigInstance);
    })

    it('multisigInstance2 transaction', async function () {
		transaction = await multisigInstance.submitTransaction(accounts[3], deposit, '0x001234', {from: accounts[0]});
    })

    it('token in contract =5', async () => {
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		assert.equal(a.toNumber(), deposit);
		console.log('token=', a.toNumber());
	});

    it('cancelfirmation [1]', async () => {
		try{
			await multisigInstance.cancelfirmation({from: accounts[1]});
			assert.ok(1);
		} catch (e) {
			console.log(e.message);
			assert.fail();
		}
	});

    it('multisig state = (canceled)', async function () {
		try{
			let a = await multisigInstance.state.call();
			assert.equal(a.toNumber(), 2);
		} catch (e) {
			//console.log(e.message);
			assert.ok(1);
		}
    });

    it('token in contract =0', async () => {
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		assert.equal(a.toNumber(), 0);
		console.log('token=', a.toNumber());
	});






});