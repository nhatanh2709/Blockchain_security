// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Callee {
  uint256 public x;

  function setX(uint256 _x) external {
    x = _x;
  }
}