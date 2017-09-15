pragma solidity ^0.4.11;

contract Contract {

  address public owner;
 
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Contract() {
    owner = msg.sender;
  }

}

