pragma solidity ^0.4.0;
contract OwnerAction {
    address owner;
    
    modifier ownerAction() {
        if(owner == msg.sender) {
            _;
        } else {
           // throw;
           revert;
        }
    }
}