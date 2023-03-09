// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FairTxn {
    enum State { AWATING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED }
    State public currentState;
    
    address payable buyer;
    address payable seller;
    address public owner;

    modifier onlyBuyer() {
        require(msg.sender==buyer);
        _;
    }

    modifier onlySeller() {
        require(msg.sender==seller);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender==owner);
        _;
    }

    constructor(address payable _buyer, address payable _seller) {
        buyer = _buyer;
        seller = _seller;
        owner = msg.sender;
        currentState = State.AWATING_PAYMENT;
    }

    function sendPayment() public payable onlyBuyer {
        require( currentState == State.AWATING_PAYMENT );
        currentState = State.AWAITING_DELIVERY;
    }
    
    function confirmDelivery() external onlyBuyer {
        require( currentState == State.AWAITING_DELIVERY );
        currentState = State.COMPLETE;
        seller.transfer(address(this).balance);
    }

    function refundBuyer() public onlyOwner {
        require(currentState == State.AWAITING_DELIVERY);
        buyer.transfer(address(this).balance);
        currentState = State.REFUNDED;
    }
}