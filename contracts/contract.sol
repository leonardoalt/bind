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

  bool signed;                  /* true once the buyer signs */
  bool terminated;              /* true once the contract is terminated */

  modifier onlyBy(address _addr) {
    require(msg.sender == _addr);
    _;
  }

  modifier notSigned() {
    require(!signed);
    _;
  }

  modifier isValidContract() {
    require(signed && !terminated);
    _;
  }

  modifier isRecurrent() {
    require(payType != PAY_TYPE.SINGLE);
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
    signed = false;
    terminated = false;
  }

  function buyerSign() public
    onlyBy(buyer)
    notSigned()
  {
    signed = true;
    if (payType == PAY_TYPE.SINGLE) {
      completeSinglePay();
    } else {
      startRecurrentPay();
    }
  }

  function completeSinglePay() private
  {
    /* TODO: should single pay contracts be terminated=true? */
    seller.transfer(payAmount);
  }

  function startRecurrentPay() private {
  }

  function buyerPayRecurring() public
    onlyBy(buyer)
    isValidContract()
    isRecurrent()
  {
    
  }
}

