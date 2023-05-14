// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract EventFunding {
    struct Event {
        uint256 id;
        address payable owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool refunded;
    }

    constructor() {}

    uint256 public numberOfEvents = 0;

    mapping(uint256 => Event) public events;
    mapping(address => uint256) public donatorDonations;
    mapping(address => Event[]) public userEvents;

    event Refund(address indexed donator, uint256 amount);
    event EventCreated(address indexed owner, string title);
    event Donation(address indexed donator, uint256 amount);

    modifier isNotExpired(uint256 _eventId) {
       Event storage _event = events[_eventId];
       require(_event.deadline < block.timestamp, "The deadline should be a date in the future.");
       _;
    }

   modifier isNotRefunded(uint256 _eventId) {
       Event storage _event = events[_eventId];
       require(!_event.refunded, "The event is already refunded.");
       _;
    }
    
    modifier isNotTargetReached(uint256 _eventId) {
       Event storage _event = events[_eventId];
       require(_event.amountCollected < _event.target, "The target has been reached.");
       _;
    }

    function createEvent(
        address _owner, 
        string memory _title, 
        string memory _description, 
        uint256 _target, 
        uint256 _deadline, 
        string memory _image
        ) public returns (uint256) {

        Event storage _event = events[numberOfEvents];

        require(!_event.refunded, "The event is already refunded.");
        
        _event.id = numberOfEvents;
        _event.owner = payable(_owner);
        _event.title = _title;
        _event.description = _description;
        _event.target = _target;
        _event.deadline = _deadline;
        _event.amountCollected = 0;
        _event.image = _image;
        _event.refunded = false;
        userEvents[_owner].push(_event);
        numberOfEvents++;

        emit EventCreated(_owner, _title);
        
        return numberOfEvents - 1;
    }

    function donateToEvent(uint256 _id) public payable isNotRefunded(_id) {
        uint256 amount = msg.value;

        Event storage _event = events[_id];
        donatorDonations[msg.sender] = amount;
        _event.donators.push(msg.sender);
        _event.donations.push(amount);

        (bool sent,) = payable(_event.owner).call{value: amount}("");

        if(sent) {
            _event.amountCollected = _event.amountCollected + amount;
            emit Donation(msg.sender, amount);
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (events[_id].donators, events[_id].donations);
    }

    function getEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](numberOfEvents);

        for(uint i = 0; i < numberOfEvents; i++) {
            Event storage item = events[i];
            allEvents[i] = item;
        }

        return allEvents;
    }

    function getMyEvents(address user) public view returns (Event[] memory) {
        return userEvents[user];
    }

    function findDonatorIndex(address target, uint256 _eventId) internal view returns (uint256) {
        for (uint256 i = 0; i < events[_eventId].donators.length; i++) {
            if (events[_eventId].donators[i] == target) {
                return i;
            }
        }
        revert("Donator not found in array");
    }

    function isRefunded(uint256 _eventId) internal view returns(bool) {
        bool refunded = true;
        for(uint256 i=0; i< events[_eventId].donations.length; i++) {
            if(events[_eventId].donations[i] > 0) {
                refunded = false;
            }
        }
        return refunded;
    }

    function isDonator(uint256 _eventId, address donator) public view returns(bool) {
        Event storage _event = events[_eventId];
        address[] storage donators = _event.donators;
        uint256[] storage donations = _event.donations;
        bool donated = false;
    
        for (uint i=0; i < donators.length; i++) {
            if (donator == donators[i] && donations[i] > 0) {
                donated = true;
            }
        }
        return donated;
    }

    function processRefund(uint256 _eventId, address _donator) public payable isNotRefunded(_eventId) isNotExpired(_eventId) {
        Event storage _event = events[_eventId];

        uint256 donatorDonation = donatorDonations[_donator];

        require(donatorDonation <= msg.value, "Amount to refund exceeds amount donated.");

        uint256 donatorIndex = findDonatorIndex(_donator, _eventId);
        _event.refunded = true;
        _event.amountCollected -= donatorDonation;
        _event.donations[donatorIndex] = 0;
        
        (bool sent,) = payable(_donator).call{value: donatorDonation}("");

        require(sent, "Failed to send Ether to the donator.");
        
        _event.refunded = isRefunded(_eventId);

        emit Refund(_donator, donatorDonation);
    }
}