pragma solidity ^0.4.0;
import "./OwnerAction.sol";
//import "github-ethereum";

contract Transaction is OwnerAction {
    
    uint256 salt = 1;
    mapping(uint256 => uint256) droneOrderMapping;

    struct Order {
        uint256 orderId;
        string pickupFrom; // Pickup Location of Drone. CSV of address,lat,lng
        string deliverTo; // Delivery Location CSV of address,lat,lng
        uint256 transactionPrice;
        uint256  droneId;
        address consumerEthAccount;
        address senderEthAccount;
        address droneEthAccount;
        Status status;
    }
    
    Order[]  orderDetails;
    
    enum Status { Open, Closed }
    
    function Transaction() payable {
        owner = msg.sender;
    }
    
   event OrderValidated(uint256 droneId, address consumerEth);
    function validateOpenOrderStatus(uint256 droneId, address consumerEth) public payable  returns (uint orderId) {
        var mappedOrderId = droneOrderMapping[droneId];
      require(mappedOrderId >= 0);
      Order currentOrder = orderDetails[mappedOrderId - salt];
        require(currentOrder.orderId >= 0);
        if(uint(currentOrder.status) == uint(Status.Open) && currentOrder.droneId == droneId) {
               OrderValidated(droneId, consumerEth);
                return currentOrder.orderId;
        }
        // TODO update mapping here?
        return 0;
    }
    
     // confirm-payment initiates this. 
    event OrderCreated(uint256 orderId, address consumerEthAccount);
    function placeOrder(string pickupFrom, string deliverTo, uint256 droneId, address consumerEth, address senderEth, address droneEth) public payable returns (uint256 orderId) {
        if (msg.value <= 0) {
            throw;
        }
        //var order = Order(pickupFrom, deliverTo, msg.value, droneId, consumerEth, senderEth, droneEth, Status.Open);
        var order = Order(orderDetails.length+salt, pickupFrom, deliverTo, msg.value, droneId, consumerEth, senderEth, droneEth, Status.Open);
        sendInitialStake();
        orderDetails.push(order);
        var orderIdVal = order.orderId;
        droneOrderMapping[droneId] = orderIdVal;
        OrderCreated(orderIdVal, consumerEth);
        return orderIdVal;
    }
    
    function sendInitialStake()  payable {
        this.transfer(msg.value);
        //owner.transfer(msg.value);
    }
    
      
    
    event OrderStatusUpdated(uint256 orderId, address consumerEth, uint256 droneId, string nodeLocation);
    function updateOrderStatus(uint256 orderId, uint256 droneId, address consumerEth, string nodeLocation) public {
        // TODO update mapping here?
        Order currentOrder = orderDetails[orderId-salt];
        require(Status.Open == currentOrder.status);
        require(droneId == currentOrder.droneId);
        //require(nodeLocation == currentOrder.deliverTo);
        currentOrder.status = Status.Closed;
        
        address droneEthAccount = currentOrder.droneEthAccount;
        droneEthAccount.transfer(currentOrder.transactionPrice);
        OrderStatusUpdated(orderId, consumerEth, droneId, nodeLocation);
    }
    
    /*function finaliseStake(Order currentOrder) {
        address droneEthAccount = currentOrder.droneEthAccount;
        droneEthAccount.transfer(currentOrder.transactionPrice);
    }*/
    
    
    event OrderReverted(uint256 orderId, address consumerEth);
    function revertPlacedOrder(uint256 orderId, address consumerEth) public {
        Order currentOrder = orderDetails[orderId-salt];
        require(Status.Open == currentOrder.status);
        currentOrder.status = Status.Closed;
        address refundTo = currentOrder.senderEthAccount;
        refundTo.transfer(currentOrder.transactionPrice);
        owner.transfer(-currentOrder.transactionPrice);
        OrderReverted(orderId, consumerEth);
    }
    function () payable {
        
    }
    
    function destroy() public ownerAction {
        selfdestruct(owner);
    }
    

  
}