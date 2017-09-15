pragma solidity ^0.4.11;

contract Contract {
  enum PAY_TYPE {
    SINGLE,
    WEEK,
    MONTH,
    YEAR
  }

  address public owner;
  address buyer;                /* the party that is paying*/
  address seller;               /* the party providing the object/service */
  string desc;                  /* contract object description */
  uint payAmount;           /* amount to be paid */

  PAY_TYPE payType;

  /* only for recurrent payments */
  uint firstPayDate;        /* used for recurrent payments */
  uint depositAmount;           /* deposit stored in the contract */
  uint endDate;                 /* date a recurrent contract finishes */

  modifier onlyBy(address _addr) {
    require(msg.sender == _addr);
    _;
  }

  function Contract(address _seller,
                    address _buyer,
                    PAY_TYPE _payType,
                    uint _payAmount,
                    uint _firstPayDate,
                    uint _depositAmount,
                    uint _endDate,
                    string _desc) public {
    owner = msg.sender;
    buyer = _buyer;
    seller = _seller;
    payType = _payType;
    firstPayDate = _firstPayDate;
    payAmount = _payAmount;
    depositAmount = _depositAmount;
    endDate = _endDate;
    desc = _desc;
  }

  function buyerSign() public
    onlyBy(buyer)
  {
  }

  function buyerPayRecurring() public
    onlyBy(buyer)
  {
  }
}

