// SPDX-License-Indentifier: None
pragma solidity ^0.8.10;
contract Caller {
    uint256 public x;
    address public callee ;

    function callCallee (uint256 _num) external {
        (bool success ,) = callee.call(abi.encodeWithSignature("setX(uint256)", _num));
        require(success, "Error");
    }

    function delegatecallCallee (uint256 _num) external {
        (bool success ,) = callee.delegatecall(abi.encodeWithSignature("setX(uint256)", _num));
        require(success, "Error");
    }

    function setCalleeAddress (address _callee) external {
        callee = _callee;
    }
}
