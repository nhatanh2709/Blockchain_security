// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract LogicV2 {
    uint256 public x;
    uint256 public y;
    function increaseX() external {
        x += 2 ;
    }

    function increaseY(uint256 _y) external {
        y =_y;
    }
}

