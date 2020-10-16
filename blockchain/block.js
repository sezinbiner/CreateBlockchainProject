const ChainUtil = require('../chain-util');
const {DIFFICULTY, MINE_RATE} = require ('../config');

class Block{
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString() {
        return `Block -
            Timestamp : ${this.timestamp}
            Last Hash : ${this.lastHash.substring(0, 10)}
            Hash      : ${this.hash.substring(0, 10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}`;
    }

    //default block to start the chain
    static genesis() {
        return new this('Genesis Time', '-------', 'f1', [], 0, DIFFICULTY);
    }
    
    //to add create a block to add to the chain
    //proof of algorithm in action firs t part of pow system
    //take the substring of the generated hash and make sure that it matches a certain number of zeros up to the block chains difficulty
    //taht ensures that the blocks are generated with the proper hash value to match our leading zero 
    //condition by adding a loop to generate
    static mineBlock(lastBlock, data) {

        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }
    //hash function to find unique hash code
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let{ difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }



}

module.exports = Block;
