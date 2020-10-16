const Block = require('./block');
const {DIFFICULTY} = require('../config');

//to test the block 
describe('Block', () => {
    //declare variables but not assign them
    let data, lastblock, block;

    //this function allow us to use this information in each unit test
    beforeEach(()=> {
        data = 'bar';
        lastblock = Block.genesis();
        block = Block.mineBlock(lastblock, data);
    });

    //unit test 1 
    it('sets the data to block match the input', () => {
        expect(block.data).toEqual(data);
    });

    //unit test 2
    it('sets the lastHash to match the last block', () => {
        expect(block.lastHash).toEqual(lastblock.hash);
    });

    it('generates a hash that matches the difficulty', ( ) => {
        expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });

    it('lowers the difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+360000)).toEqual(block.difficulty - 1);
    });

    
    it('raises the difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+1)).toEqual(block.difficulty + 1);
    });
});