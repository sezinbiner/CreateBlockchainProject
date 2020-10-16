const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }
    
    // adds a new transaction or rather a new output object to an existing transaction by the sender. It updates the output dealing the retailing the resulting amount and add a new output for the new recipient
    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if(amount > senderOutput.amount) { 
            console.log(`Amount: $(amount) exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount-amount;
        this.outputs.push({ amount, address:recipient});
        Transaction.signTransaction(this, senderWallet);

        return this;

    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static newTransaction(senderWallet, recipient, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ]);
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, 
            address:minerWallet.publicKey,
        }]);
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp : Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction, senderWallet) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        ); 
    }

}

module.exports = Transaction;