//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract MyPets {
    string public MyDog;
    address public Owner;
    constructor(string memory _myDog) {
        Owner = msg.sender;
        MyDog = _myDog;
    }

    function transferOwnership(address _newOwner) external OnlyOwner{
        Owner = _newOwner;
    }

    function updateDog(string memory _myDog) external OnlyOwner(){
        MyDog = _myDog;
    }

    modifier OnlyOwner() {
        require(msg.sender == Owner , "Ownable : new owner is the zero address");
        _;
    }
}