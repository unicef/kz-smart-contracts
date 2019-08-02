const MultiSigWallet = artifacts.require('MultiSigWallet')
const web3 = MultiSigWallet.web3
//const TestToken = artifacts.require('TestToken')
//const TestCalls = artifacts.require('TestCalls')
const utils = require('./utils')




contract('MultiSigWallet', (accounts) => {

	let tokenInstance;
	let callsInstance;
	let hello;
	let multisigInstance;
	let transaction;
	let transactionId;
	let transaction2;
	const requiredConfirmations = 2
	let deposit = 5;
	let balances = [];


    before('deploy', async function () {
		console.log('account:');
		balances = [
			await web3.eth.getBalance(accounts[0]),
			await web3.eth.getBalance(accounts[1]),
			await web3.eth.getBalance(accounts[2]),
			await web3.eth.getBalance(accounts[3]),
			];
		console.log(accounts[0], balances[0]);
		console.log(accounts[1], balances[1]);
		console.log(accounts[2], balances[2]);
		console.log(accounts[3], balances[3]);

		multisigInstance = await MultiSigWallet.new([accounts[0], accounts[1]], requiredConfirmations);
		assert.ok(multisigInstance);
    })


    it('owners', async function () {
		let owners = await multisigInstance.getOwners();
		assert.deepEqual([accounts[0], accounts[1]], owners );
    })

    it('deposit '+deposit, async () => {
        await new Promise((resolve, reject) => web3.eth.sendTransaction({to: multisigInstance.address, value: deposit, from: accounts[0]}, e => (e ? reject(e) : resolve())))
        const balance = await utils.balanceOf(web3, multisigInstance.address);
		console.log('balance', balance);
		assert.equal(balance.valueOf(), deposit );
    })


/*
    beforeEach('setup contract for each test', async function () {

		multisigInstance = await MultiSigWallet.new([accounts[0], accounts[1]], requiredConfirmations)
        tokenInstance = await TestToken.new();
        callsInstance = await TestCalls.new();

        await new Promise((resolve, reject) => web3.eth.sendTransaction({to: multisigInstance.address, value: deposit, from: accounts[0]}, e => (e ? reject(e) : resolve())))
        const balance = await utils.balanceOf(web3, multisigInstance.address);
		console.log('balance',balance.valueOf());
    })
*/

    it('addOwner', async () => {
		await multisigInstance.addOwner(accounts[2]);
		let owners = await multisigInstance.getOwners();
		assert.deepEqual([accounts[0], accounts[1], accounts[2]], owners );
	});

    it('changeRequirement =3', async () => {
		await multisigInstance.changeRequirement(3);
		let a = await multisigInstance.required();
		assert.equal(a, 3);
	});

    it('removeOwner', async () => {
		await multisigInstance.changeRequirement(2);
		await multisigInstance.removeOwner(accounts[2]);
		let owners = await multisigInstance.getOwners();
		assert.deepEqual([accounts[0], accounts[1]], owners );
	});

    it('submitTransaction', async () => {
		transaction = await multisigInstance.submitTransaction(accounts[3], deposit, '0x00', {from: accounts[0]});
		assert.ok(transaction);
		//console.log('transaction', transaction);
		transactionId = 0;

		transaction2 = await multisigInstance.submitTransaction(accounts[3], deposit, '0x01', {from: accounts[1]});
		//console.log('transaction', transaction);
	});

    it('getConfirmations', async () => {
		let tmp = await multisigInstance.getConfirmations(transactionId);
		console.log('getConfirmations', tmp);
		assert.deepEqual([accounts[0]], tmp );
	});

    it('getTransactionIds', async () => {
		let tmp3 = await multisigInstance.getTransactionIds(0, 10, true, true);
		//console.log('getTransactionIds', tmp3);
		assert.equal(tmp3.length, 2 );
	});


    it('isConfirmed false', async () => {
		let a = await multisigInstance.isConfirmed(transactionId);
		assert.isFalse(a);
	});

    it('getConfirmationCount =1', async () => {
		let a = await multisigInstance.getConfirmationCount(transactionId);
		assert.equal(a, 1);
	});

    it('confirmTransaction accounts[1]', async () => {
		try{
			await multisigInstance.confirmTransaction(transactionId, {from: accounts[1]});
			assert.ok(1);
		} catch (e) {
			console.log(e.message);
			assert.fail();
		}
	});

    it('isConfirmed true', async () => {
		let a = await multisigInstance.isConfirmed(transactionId);
		assert.isTrue(a);
	});

    it('balance', async () => {
		let newbalances = [
			await web3.eth.getBalance(accounts[0]),
			await web3.eth.getBalance(accounts[1]),
			await web3.eth.getBalance(accounts[2]),
			await web3.eth.getBalance(accounts[3]),
			];

		console.log(accounts[0], newbalances[0]);
		console.log(accounts[1], newbalances[1]);
		console.log(accounts[2], newbalances[2]);
		console.log(accounts[3], newbalances[3]);

		let dif= web3.utils.toBN(newbalances[3]).sub(web3.utils.toBN(balances[3]));

		assert.equal(dif.toNumber(), deposit);
	});



//Error: Returned error: VM Exception while processing transaction: revert


});