pragma solidity ^0.4.11;

contract Contract {
  enum PAY_TYPE {
    SINGLE,
    WEEK,
    MONTH,
    YEAR
  }

  address public owner;
  address public buyer;                /* the party that is paying*/
  address public seller;               /* the party providing the object/service */
  string public buyerName;
  string public sellerName;
  string public desc;                  /* contract object description */
  uint public payAmount;           /* amount to be paid */

  PAY_TYPE public payType;

  /* only for recurrent payments */
  uint public firstPayDueDate;        /* recurrent payment first due date */
  uint public depositAmount;           /* deposit stored in the contract */
  uint public endDate;                 /* date a recurrent contract finishes */

  bool public signed;                  /* true once the buyer signs */
  bool public terminated;              /* true once the contract is terminated */

  uint public currentPayment;            /* number of times the buyer paid a recurrent pay */

  uint public sellerWithdraw;

  modifier onlyBy(address _addr) {
    require(msg.sender == _addr);
    _;
  }

  modifier buyerOrSeller() {
    require(msg.sender == buyer || msg.sender == seller);
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

  modifier isCurrentPayment(uint paymentNumber) {
    require(currentPayment == paymentNumber);
    _;
  }

  modifier hasFunds(uint _value) {
    require(msg.value >= _value);
    _;
  }

  function Contract(address _seller,
                    address _buyer,
                    string _sellerName,
                    string _buyerName,
                    PAY_TYPE _payType,
                    uint _payAmount,
                    uint _firstPayDueDate,
                    uint _depositAmount,
                    uint _endDate,
                    string _desc) public {
    owner = msg.sender;
    buyer = _buyer;
    seller = _seller;
    sellerName = _sellerName;
    buyerName = _buyerName;
    payType = _payType;
    firstPayDueDate = _firstPayDueDate;
    payAmount = _payAmount;
    depositAmount = _depositAmount;
    endDate = _endDate;
    desc = _desc;
    signed = false;
    terminated = false;
    currentPayment = 0;
    sellerWithdraw = 0;
  }

  function buyerSign() payable public
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

  function withdraw() public
    onlyBy(seller)
  {
    uint amount = sellerWithdraw;
    sellerWithdraw = 0;
    seller.transfer(amount);
  }

  function completeSinglePay() private
    hasFunds(payAmount)
  {
    /* TODO: should single pay contracts be terminated=true? */
    require((sellerWithdraw + payAmount) >= sellerWithdraw);
    sellerWithdraw += payAmount;
  }

  /* make sure the buyer makes the deposit */
  function startRecurrentPay() private
    hasFunds(depositAmount)
  {
  }

  /* buyer can only pay the current payment */
  function buyerPayRecurring(uint paymentNumber) payable public
    onlyBy(buyer)
    isValidContract()
    isRecurrent()
    isCurrentPayment(paymentNumber)
    hasFunds(payAmount)
  {
    currentPayment++;
    require((sellerWithdraw + payAmount) >= sellerWithdraw);
    sellerWithdraw += payAmount;
  }

  function terminateContract() public
    buyerOrSeller()
    isValidContract()
    isRecurrent()
  {
    /* TODO: can a contract be terminated if there are pending
       payments? What should we do about pending payments? */
  }
}
