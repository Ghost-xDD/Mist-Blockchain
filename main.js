const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

//   two zeros
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block Mined:  ' + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, '15/03/2022', 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //   sets previous hash, calculates new hash
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let Sigmacoin = new Blockchain();

console.log('Mining block 1....');
Sigmacoin.addBlock(new Block(1, '16/03/2022', { amount: 4 }));

console.log('Mining block 2....');
Sigmacoin.addBlock(new Block(2, '20/03/2022', { amount: 28 }));

// console.log('Is Blockchain Valid?' + Sigmacoin.isChainValid());

// // Tamper with the blockchain to demonstrate validity
// // Sigmacoin.chain[1].data = { amount: 100 };
// // Sigmacoin.chain[1].hash = Sigmacoin.chain[1].calculateHash();

// // console.log('Is Blockchain Valid?' + Sigmacoin.isChainValid());
