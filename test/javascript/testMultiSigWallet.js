const MultiSigWallet = artifacts.require('MultiSigWallet')
const web3 = MultiSigWallet.web3
const DigicusToken = artifacts.require('DigicusToken')
//const TestCalls = artifacts.require('TestCalls')
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

	it('balances', async function () {
		console.log('account:');
		balances = [
			await web3.eth.getBalance(accounts[0]),
			await web3.eth.getBalance(accounts[1]),
			await web3.eth.getBalance(accounts[2]),
			await web3.eth.getBalance(accounts[3]),
			];
		balancesToken = [
			await tokenInstance.balanceOf(accounts[0]),
			await tokenInstance.balanceOf(accounts[1]),
			await tokenInstance.balanceOf(accounts[2]),
			await tokenInstance.balanceOf(accounts[3]),
			];

		console.log(accounts[0], balances[0], balancesToken[0].toNumber());
		console.log(accounts[1], balances[1], balancesToken[1].toNumber());
		console.log(accounts[2], balances[2], balancesToken[2].toNumber());
		console.log(accounts[3], balances[3], balancesToken[3].toNumber());
	});


    it('multisigInstance', async function () {
		multisigInstance = await MultiSigWallet.new(tokenInstance.address, [accounts[0], accounts[1]], requiredConfirmations);
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		console.log('multisigInstance', multisigInstance.address, a.toNumber() );
		assert.ok(multisigInstance);

    })




    it('submitTransaction 0=>3  0=>3', async function () {
		await tokenInstance.issueTokens(accounts[0], depositToken);
		let balance = await tokenInstance.balanceOf(accounts[0]);
		assert.equal(balance.toNumber(), depositToken);

		transaction = await multisigInstance.submitTransaction(accounts[3], deposit, '0x00', {from: accounts[0]});
		transactionId = 0;
		//await tokenInstance.issueTokens(multisigInstance.address, depositToken);
		let a = await tokenInstance.balanceOf(multisigInstance.address);
		console.log('multisig tokens', a.toNumber());


		transaction2 = await multisigInstance.submitTransaction(accounts[3], deposit, '0x01', {from: accounts[0]});

    })


	it('balances', async function () {
		console.log('account:');
		balances = [
			await web3.eth.getBalance(accounts[0]),
			await web3.eth.getBalance(accounts[1]),
			await web3.eth.getBalance(accounts[2]),
			await web3.eth.getBalance(accounts[3]),
			];
		balancesToken = [
			await tokenInstance.balanceOf(accounts[0]),
			await tokenInstance.balanceOf(accounts[1]),
			await tokenInstance.balanceOf(accounts[2]),
			await tokenInstance.balanceOf(accounts[3]),
			];

		console.log(accounts[0], balances[0], balancesToken[0].toNumber());
		console.log(accounts[1], balances[1], balancesToken[1].toNumber());
		console.log(accounts[2], balances[2], balancesToken[2].toNumber());
		console.log(accounts[3], balances[3], balancesToken[3].toNumber());
	});


    it('owners', async function () {
		let owners = await multisigInstance.getOwners();
		console.log('owners=', owners.join());
		assert.deepEqual([accounts[0], accounts[1]], owners );
    })

/*
    it('deposit '+deposit, async () => {
        await new Promise((resolve, reject) => web3.eth.sendTransaction({to: multisigInstance.address, value: deposit, from: accounts[0]}, e => (e ? reject(e) : resolve())))
        const balance = await utils.balanceOf(web3, multisigInstance.address);
		console.log('balance', balance);
		assert.equal(balance.valueOf(), deposit );
    })
*/


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

    it('confirmTransaction accounts[2] =false', async () => {
		try{
			await multisigInstance.confirmTransaction(transactionId, adrZero, {from: accounts[2]});
			assert.fail(1);
		} catch (e) {
			console.log(e.message);
			assert.ok(1);
		}
	});


    it('removeOwner', async () => {
		await multisigInstance.changeRequirement(2);
		await multisigInstance.removeOwner(accounts[2]);
		let owners = await multisigInstance.getOwners();
		assert.deepEqual([accounts[0], accounts[1]], owners );
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


    it('isConfirmed =false', async () => {
		let a = await multisigInstance.isConfirmed(transactionId);
		assert.isFalse(a);
	});

    it('getConfirmationCount =1', async () => {
		let a = await multisigInstance.getConfirmationCount(transactionId);
		assert.equal(a, 1);
	});


    it('confirmTransaction accounts[1]  next[2]', async () => {
		try{
			await multisigInstance.confirmTransaction(transactionId, accounts[2], {from: accounts[1]});
			assert.ok(1);
		} catch (e) {
			console.log(e.message);
			assert.fail();
		}
	});

    it('getConfirmationCount =2', async () => {
		let a = await multisigInstance.getConfirmationCount(transactionId);
		assert.equal(a, 2);
	});

    it('confirmTransaction accounts[2]', async () => {
		try{
			await multisigInstance.confirmTransaction(transactionId, adrZero, {from: accounts[2]});
			assert.ok(1);
		} catch (e) {
			console.log(e.message);
			assert.fail();
		}
	});


    it('isConfirmed =true', async () => {
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
		let newbalancesToken = [
			await tokenInstance.balanceOf(accounts[0]),
			await tokenInstance.balanceOf(accounts[1]),
			await tokenInstance.balanceOf(accounts[2]),
			await tokenInstance.balanceOf(accounts[3]),
			];

		console.log(accounts[0], balances[0], newbalancesToken[0].toNumber());
		console.log(accounts[1], balances[1], newbalancesToken[1].toNumber());
		console.log(accounts[2], balances[2], newbalancesToken[2].toNumber());
		console.log(accounts[3], balances[3], newbalancesToken[3].toNumber());


		let dif= web3.utils.toBN(newbalancesToken[3]).sub(web3.utils.toBN(balancesToken[3]));
		console.log('dif=',dif);

		assert.equal(dif.toNumber(), deposit);
	});



//Error: Returned error: VM Exception while processing transaction: revert


});