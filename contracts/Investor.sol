//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingAccount {
    function deposit() external payable;

    function withdraw() external;
}

contract Investor is Ownable {
    ISavingAccount public immutable savingAccount;

    constructor(address savingAccountAddress) Ownable(msg.sender){
        savingAccount = ISavingAccount(savingAccountAddress);
    }

    function depositIntoSavingAccount() external payable onlyOwner{
        savingAccount.deposit{ value : msg.value} ();
    }

    function withdrawFromSavingAccount() external onlyOwner{
        savingAccount.withdraw();
    }

    function withdraw () external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    receive() external payable {}

} 
