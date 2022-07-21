//// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Token {

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSuply;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSuply){
        name=_name;
        symbol=_symbol;
        decimals=_decimals;
        totalSuply=_totalSuply;
    }

}
