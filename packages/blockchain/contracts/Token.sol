//// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

error Token__Not_Enough_Funds();
error Token__Burn_Forbidden();
error Token__Unauthorized_Transfer();

contract Token {

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address=>uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply){
        name=_name;
        symbol=_symbol;
        decimals=_decimals;
        totalSupply=_totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        if (balanceOf[msg.sender]<_value){
            revert Token__Not_Enough_Funds();
        }

        if(_to==address(0)){
            revert Token__Burn_Forbidden();
        }

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] +=_value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){

        if(_spender==address(0)){
            revert Token__Burn_Forbidden();
        }
      
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){

     if(_to==address(0)){
            revert Token__Burn_Forbidden();
    }
    if(_value>allowance[_from][msg.sender]){
            revert Token__Unauthorized_Transfer();
    }
    if (balanceOf[_from]<_value){
                revert Token__Not_Enough_Funds();
    }

        allowance[_from][msg.sender]-=_value;

        balanceOf[_from] -= _value;
        balanceOf[_to] +=_value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
