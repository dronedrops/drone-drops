pragma solidity ^0.4.4;

contract DroneDrops {
Drone[5] public registeredDrones;
mapping(uint256 => address) public addressMapper; //list of ids, this can be marked as address as well
address owner;

mapping(uint256 => Request) public requestTracker;

uint public requestIdCounter;


struct Drone {
        uint droneId; //primary identifier
        uint capacity;   // maximum weigth this drone can carry forward in lbs
        string location; // comma seperated latitude and longitude values
        string eth;
        string picture;
    }
    
    struct Request {
        uint requestId;
        uint droneId; //primary identifier
        string fromLocation; // comma seperated latitude and longitude values
        string toLocation;
    }

    function DroneDrops() {
        requestIdCounter = 0;
        owner = msg.sender;
        var drone1 = Drone(0, 100,"53.780698,-1.534391","0.54","../images/drones/drone1.jpeg");
        registeredDrones[0] = (drone1);
         var drone2 = Drone(1, 200,"51.513680,-0.08653","0.43","../images/drones/drone2.jpeg");
        registeredDrones[1] = (drone2);
         var drone3 = Drone(2, 50,"51.528737,0.055472","0.46","../images/drones/drone3.jpeg");
        registeredDrones[2] = (drone3);
         var drone4 = Drone(3, 6,"51.556021,-0.279519","0.76","../images/drones/bot1.png");
        registeredDrones[3] = (drone4);
        var drone5 = Drone(4, 90,"55.864237,-4.251806","0.49","../images/drones/bot2.png");
        registeredDrones[4] = (drone5);
    }

    modifier isTheContractOwner() {
        if(owner != msg.sender) {
            throw;
        } else {
            _;
        }
    }

function getDroneById(uint id) constant public returns(uint droneId, uint capacity, string location, string eth, string picture) {
    Drone d = registeredDrones[id];
    droneId = d.droneId;
    capacity = d.capacity;
    location = d.location;
    eth = d.eth;
    picture = d.picture;
    }


    function requestDelivery(uint droneId, string fromLocation, string toLocation) constant public {
        requestTracker[requestIdCounter] = Request(requestIdCounter, droneId, fromLocation, toLocation);
        requestIdCounter++;
    }

    function updateLocation(uint droneId, string currentLocation) returns(uint result) {
        return 0;
    }
    
    function associateAddressToId(uint id) public {
        addressMapper[id] = msg.sender;
    }

}