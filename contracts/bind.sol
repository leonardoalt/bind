pragma solidity ^0.4.11;

import './contract.sol';

contract Bind {

  address public owner;
  /* store contracts for each addr */
  mapping (address => Contract[]) addrContracts;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier onlyAddress(address _addr) {
    require(msg.sender == _addr);
    _;
  }

  function Bind() public {
    owner = msg.sender;
  }

  function createSinglePayContract(address _buyer,
                                   uint _payAmount,
                                   string _desc) public {
    Contract _contract = new Contract(msg.sender,
                                      _buyer,
                                      Contract.PAY_TYPE.SINGLE,
                                      _payAmount,
                                      0,
                                      0,
                                      0,
                                      _desc);
    addrContracts[msg.sender].push(_contract);
    addrContracts[_buyer].push(_contract);
  }

  function createRecurrentPayContract(address _buyer,
                          Contract.PAY_TYPE _payType,
                          uint _payAmount,
                          uint _firstPayDate,
                          uint _depositAmount,
                          uint _endDate,
                          string _desc) public {
    Contract _contract = new Contract(msg.sender,
                                      _buyer,
                                      _payType,
                                      _payAmount,
                                      _firstPayDate,
                                      _depositAmount,
                                      _endDate,
                                      _desc);
    addrContracts[msg.sender].push(_contract);
    addrContracts[_buyer].push(_contract);
  }

  function getContracts() public constant returns(Contract[]) {
    return addrContracts[msg.sender];
  }
}

