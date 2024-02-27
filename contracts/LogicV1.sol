// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract LogicV1 {
    uint256 public x;

    function increaseX() external {
        x+=1;
    }
}
