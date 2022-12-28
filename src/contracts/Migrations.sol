  pragma solidity ^0.5.0;

contract Migrations{
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

// only owner mode enabled.. if anyone else then shows eroor
    modifier restricted () {
        if (msg.sender == owner) _;
    }
//for completing the migration
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }  

//function for upgrading the migration incase of new migrations
    function upgrade(address new_address) public restricted{
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);

    }

    }



