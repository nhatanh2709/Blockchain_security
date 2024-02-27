//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;


interface  ILottery {
    function placeBet(uint8 _number) external payable;
    
}
contract SavingsAccount {
    mapping (address => uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }
    
    
    function withdraw() external {
        uint256 amountDeposited = balanceOf[msg.sender];

        balanceOf[msg.sender] = 0;
        payable(msg.sender).transfer(amountDeposited);
    }
}