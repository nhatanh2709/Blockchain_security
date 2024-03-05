// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
contract VRFD20 is VRFConsumerBaseV2, ConfirmedOwner {
    event RequestSent( uint256 requestId, uint32 numWords) ;
    event RequestFulfilled(uint256 requestId , uint256 [] randomWords);

    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint256[] randomWords;
    }
    
    mapping(uint256 => RequestStatus) public s_requests;
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;
    bytes32 keyHash =0x44e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    uint32 callbackGasLimit = 1;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;
    function requestRandomWords() external  onlyOwner returns (uint256 requestId) 
    {
        requestId = COORDINATOR.requestRandomWords(
            keyHash, 
            s_subscriptionId, 
            requestConfirmations, 
            callbackGasLimit, 
            numWords);
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled:false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }



















































    
    
