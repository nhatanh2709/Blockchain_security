//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable {
    bytes32 private password;

    constructor (bytes32 _password,address _owner) Ownable(_owner) {
        password = _password;
    }

    modifier checkPassWord(bytes32 _password) {
        require(password == _password, "Wrong password");
        _;
    }
   
   function deposit() external payable onlyOwner{}

   function withdraw(bytes32 _password) external checkPassWord(_password) {
        payable(msg.sender).transfer(address(this).balance);
   }
}