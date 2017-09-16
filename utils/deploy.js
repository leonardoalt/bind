const Web3 = require('web3');
const fs = require('fs');

const BindABI = JSON.parse(fs.readFileSync('./compiledContracts/Bind.abi'));
const BindBin = `0x${fs.readFileSync('./compiledContracts/Bind.bin').toString()}`

const ContractABI = JSON.parse(fs.readFileSync('./compiledContracts/Contract.abi'));
const ContractBin = `0x${fs.readFileSync('./compiledContracts/Contract.bin').toString()}`

var BindJSON = require('../build/contracts/Bind.json');
var ContractJSON = require('../build/contracts/Contract.json');

const deployAddress = '0xc94f82d15969e8444c95aa8380267cd2ac65caa8';
//const deployAddress = '0x82De95A2c2805731a404C4F652514929cdB463bb';

var web3 = new Web3('http://localhost:8545');

function writeBinABI(buildPath, jsonFile, networkId, address, abi, bin, timestamp) {
  const obj = {
    address: address,
    updated_at: timestamp
  }
  jsonFile.networks[networkId] = obj;
  jsonFile['unlinked_binary'] = bin;
  jsonFile['abi'] = abi;
  fs.writeFileSync(buildPath, JSON.stringify(jsonFile, undefined, 2));
}

function deployContract(contractABI, contractBin, address) {
  return new Promise((resolve, reject) => {
    var monarchyContract = new web3.eth.Contract(contractABI);
    monarchyContract.deploy({
      data: contractBin
    }).send({
      from: address,
      gas: 3940000 
    })
    .on('error', (err) => {console.log('error', err)})
    .on('confirmation', (block, tx) => {
      resolve(tx.contractAddress)
    })
    .catch(() => {});
  });
}

async function deployAll() {
  try{
    const networkId = await web3.eth.net.getId();
    const now = Date.now();

    var _l = process.argv.length;
    if (_l > 2 && process.argv[2] === 'geth') {
      if (_l < 4) {
        console.log('If you want to deploy on geth you should give me the password');
        return;
      }
      var unlockRes = await web3.eth.personal.unlockAccount(deployAddress, process.argv[3], 300)
      if (unlockRes === false) {
        console.log('Could not unlock account ' + deployAddress);
        return;
      }
    }

    console.log('Deploying in networkId:', networkId);

    console.log('Deploying Contract...');
    writeBinABI('./build/contracts/Contract.json', ContractJSON, 
                networkId, undefined, ContractABI, ContractBin, now);
    console.log('Deployed');

    console.log('Deploying Bind...');
    const bindAddress = await deployContract(BindABI, BindBin, deployAddress);
    writeBinABI('./build/contracts/Bind.json', BindJSON, 
                networkId, bindAddress, BindABI, BindBin, now);
    console.log('Deployed');

    process.exit();
  }
  catch(err) {
    console.error(err);
  }
}

deployAll();
