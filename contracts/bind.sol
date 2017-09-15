pragma solidity ^0.4.11;

contract Bind {

  address public owner;
 
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Bind() {
    owner = msg.sender;
  }

}

