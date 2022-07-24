//// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";
import "hardhat/console.sol";

error Exchange__Insufficient_Tokens();
error Exchange__Unauthorized_Cancel();
error Exchange__Order_Doesnt_Exist();
error Exchange__Order_Cant_Be_Completed();
error Exchange__Order_Cancelled();

contract Exchange {
    struct OrderStruct {
        uint256 _id;
        address creator;
        address tokenReceive;
        address tokenSend;
        uint256 amountReceive;
        uint256 amountSend;
        uint256 ts;
    }

    address public exchangeAccount;
    uint256 public fee;
    uint256 public orderCount;
    mapping(address => mapping(address => uint256)) internal tokensToUsers;
    mapping(uint256 => OrderStruct) idToOrder;
    mapping(uint256 => bool) public idToCancelledStatus;
    mapping(uint256 => bool) public idToCompletedStatus;

    event Deposit(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );
    event Withdraw(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );
    event NewOrder(
        uint256 _id,
        address _creator,
        address _tokenReceive,
        address _tokenSend,
        uint256 _amountReceive,
        uint256 _amountSend,
        uint256 _ts
    );
    event Cancel(
        uint256 _id,
        address _creator,
        address _tokenReceive,
        address _tokenSend,
        uint256 _amountReceive,
        uint256 _amountSend,
        uint256 _ts
    );
    event NewTrade(
        uint256 _id,
        address _initiator,
        address _tokenReceive,
        uint256 _amountReceive,
        address _tokenSend,
        uint256 _amountSend,
        address _creator,
        uint256 _timestamp
    );

    constructor(address _exchangeAccount, uint256 _fee) {
        exchangeAccount = _exchangeAccount;
        fee = _fee;
    }

    function deposit(address _token, uint256 _amount)
        public
        returns (bool success)
    {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokensToUsers[_token][msg.sender] += _amount;
        emit Deposit(
            _token,
            msg.sender,
            _amount,
            tokensToUsers[_token][msg.sender]
        );
        return true;
    }

    function withdraw(address _token, uint256 _amount)
        public
        returns (bool success)
    {
        if (tokensToUsers[_token][msg.sender] < _amount) {
            revert Exchange__Insufficient_Tokens();
        }

        tokensToUsers[_token][msg.sender] -= _amount;
        Token(_token).transfer(msg.sender, _amount);
        emit Withdraw(
            _token,
            msg.sender,
            _amount,
            tokensToUsers[_token][msg.sender]
        );
        return true;
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokensToUsers[_token][_user];
    }

    // Refactor to tuples
    function placeOrder(
        address _tokenReceive,
        uint256 _amountReceive,
        address _tokenSend,
        uint256 _amountSend
    ) public returns (bool success) {
        if (balanceOf(_tokenSend, msg.sender) < _amountSend) {
            revert Exchange__Insufficient_Tokens();
        }

        orderCount++;
        idToOrder[orderCount] = OrderStruct(
            orderCount,
            msg.sender,
            _tokenReceive,
            _tokenSend,
            _amountReceive,
            _amountSend,
            block.timestamp
        );
        emit NewOrder(
            orderCount,
            msg.sender,
            _tokenReceive,
            _tokenSend,
            _amountReceive,
            _amountSend,
            block.timestamp
        );
        return true;
    }

    function cancelOrder(uint256 _id) public returns (bool success) {
        OrderStruct storage order = idToOrder[_id];
        if (order._id != _id) {
            revert Exchange__Order_Doesnt_Exist();
        }
        if (address(order.creator) != msg.sender) {
            revert Exchange__Unauthorized_Cancel();
        }

        idToCancelledStatus[_id] = true;
        emit Cancel(
            _id,
            order.creator,
            order.tokenReceive,
            order.tokenSend,
            order.amountReceive,
            order.amountSend,
            order.ts
        );
        return true;
    }

    function fillOrder(uint256 _id) public returns (bool success) {
        if (_id < 0 || _id > orderCount) {
            revert Exchange__Order_Doesnt_Exist();
        }

        if (idToCompletedStatus[_id]) {
            revert Exchange__Order_Cant_Be_Completed();
        }

        if (idToCancelledStatus[_id]) {
            revert Exchange__Order_Cancelled();
        }
        OrderStruct storage _order = idToOrder[_id];
        _makeTrade(
            _order._id,
            _order.creator,
            _order.tokenReceive,
            _order.amountReceive,
            _order.tokenSend,
            _order.amountSend
        );

        idToCompletedStatus[_id] = true;
        return true;
    }

    function _makeTrade(
        uint256 _orderId,
        address _creator,
        address _tokenReceive,
        uint256 _amountReceive,
        address _tokenSend,
        uint256 _amountSend
    ) internal {
        uint256 _feeAmount = (_amountReceive * fee) / 100;

        tokensToUsers[_tokenReceive][msg.sender] += uint256(
            _amountReceive + _feeAmount
        );
        tokensToUsers[_tokenSend][_creator] -= _amountSend;

        tokensToUsers[_tokenReceive][exchangeAccount] += _feeAmount;

        tokensToUsers[_tokenSend][msg.sender] += _amountSend;
        tokensToUsers[_tokenReceive][_creator] += _amountReceive;

        emit NewTrade(
            _orderId,
            msg.sender,
            _tokenReceive,
            _amountReceive,
            _tokenSend,
            _amountSend,
            _creator,
            block.timestamp
        );
    }
}
