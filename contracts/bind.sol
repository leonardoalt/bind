pragma solidity ^0.4.11;

import './contract.sol';

contract Bind {

  address public owner;
  mapping (address => Contract[]) contracts1p; 
  mapping (address => Contract[]) contracts2p; 

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyAddress(address _addr) {
    require(msg.sender == _addr);
    _;
  }

  function Bind() {
    owner = msg.sender;
  }

  function createContract(address _p2,
                          Contract.PAY_TYPE _payType, 
                          uint _payDate1, 
                          uint _payValue, 
                          uint _payDeposit,
                          uint _endDate,
                          string _desc) {
    Contract _contract = new Contract(msg.sender, _p2, _payType, _payDate1, 
                                      _payValue, _payDeposit, 
                                      _endDate, _desc);
    contracts1p[msg.sender].push(_contract);
    contracts2p[_p2].push(_contract);
  }

  function getContracts1p() constant returns(Contract[]) {
    return contracts1p[msg.sender];
  }
    
  function getContracts2p() constant returns(Contract[]) {
    return contracts2p[msg.sender];
  }
 
}

