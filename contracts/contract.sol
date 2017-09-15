pragma solidity ^0.4.11;

contract Contract {

  enum PAY_TYPE {
    SINGLE,
    WEEK,
    MONTH,
    YEAR
  }

  address public owner;
  address party1;
  address party2;
  PAY_TYPE payType;
  uint payDate1;
  uint payValue;
  uint payDeposit;
  uint endDate;
  string desc;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Contract(address _p1, address _p2,
                    PAY_TYPE _payType, uint _payDate1,
                    uint _payValue, uint _payDeposit,
                    uint _endDate, string _desc) {
    owner = msg.sender;
    party1 = _p1;
    party2 = _p2;
    payType = _payType;
    payDate1 = _payDate1;
    payValue = _payValue;
    payDeposit = _payDeposit;
    endDate = _endDate;
    desc = _desc;
  }

}

