//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Lottery is Ownable {
    constructor() Ownable(msg.sender)
    {

    }
    using Address for address payable;

    uint8 public winningNumber;
    mapping(address => uint8) public bets;
    bool public bestClosed;
    bool public prizeTaken;

    function placeBet(uint8 _number) external payable {
        require(bets[msg.sender] == 0 ,"Only 1 bet per player");
        require(msg.value == 10 ether, "Bet cost: 10 ether");
        require(bestClosed == false , "Bet are closed");
        require(_number > 0 && _number <= 255 , "Must be a number from 1 to 255");

        bets[msg.sender] = _number;
    }

    function endLottery() external onlyOwner{
        bestClosed = true;
        winningNumber = pseudoRandNumGen() ;
    }

    function withdrawPrize() external {
        require( bestClosed == true ,"Bets are still open");
        require( prizeTaken == false , "Prize already taken");
        require(bets[msg.sender]  == winningNumber, "You aren't the winner");

        prizeTaken = true;
        payable(msg.sender).sendValue(address(this).balance);
    }

    function pseudoRandNumGen() private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encode(block.timestamp)))%256) + 1;
    }
}