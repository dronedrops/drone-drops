pragma solidity ^0.4.0;
import "./OwnerAction.sol";
//import "github-ethereum";
//import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract Transaction is OwnerAction {
    //using strings for *;
    uint256 salt = 1;
    mapping(string => uint256) droneOrderMapping;
    struct Order {
        uint256 orderId;
        string pickupFrom; // Pickup Location of Drone. CSV of address,lat,lng
        string deliverTo; // Delivery Location CSV of address,lat,lng
        uint256 transactionPrice;
        string  droneId;
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
    
   event OrderValidated(string droneId, address consumerEth);
    function validateOpenOrderStatus(string droneId, address consumerEth) public payable  returns (uint orderId) {
        var mappedOrderId = droneOrderMapping[droneId];
        require(mappedOrderId >= 0);
        Order currentOrder = orderDetails[mappedOrderId - salt];
        require(currentOrder.orderId >= 0);
        if(uint(currentOrder.status) == uint(Status.Open) && sha3(currentOrder.droneId) == sha3(droneId)) {
            OrderValidated(droneId, consumerEth);
            return currentOrder.orderId;
        }
        // TODO update mapping here?
        return 0;
    }
    
     // confirm-payment initiates this. 
    event OrderCreated(uint256 orderId, address consumerEthAccount);
    function placeOrder(string pickupFrom, string deliverTo, string droneId, address consumerEth, address senderEth, address droneEth) public payable returns (uint256 orderId) {
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
    
    event OrderStatusUpdated(uint256 orderId, address consumerEth, string droneId, string nodeLocation);
    function updateOrderStatus(uint256 orderId, string droneId, address consumerEth, string nodeLocation) public returns (address droneEthAccounst){
        // TODO update mapping here?
        //Order currentOrder = orderDetails[orderId-salt];
        var mappedOrderId = droneOrderMapping[droneId];
        require(mappedOrderId >= 0);
        Order currentOrder = orderDetails[mappedOrderId - salt];
        require(Status.Open == currentOrder.status);
        sha3(droneId) == sha3(currentOrder.droneId);
        //require(nodeLocation == currentOrder.deliverTo);
        currentOrder.status = Status.Closed;
        //finaliseStake(currentOrder);
        address droneEthAccount = currentOrder.droneEthAccount;
        droneEthAccount.transfer(currentOrder.transactionPrice);
        OrderStatusUpdated(mappedOrderId, consumerEth, droneId, nodeLocation);
        return droneEthAccount;
    }
    
    /*function finaliseStake(Order currentOrder) {
        address droneEthAccount = currentOrder.droneEthAccount;
        droneEthAccount.transfer(currentOrder.transactionPrice);
    }*/
    
    event OrderReverted(uint256 orderId, address consumerEth);
    function revertPlacedOrder(string droneId, address consumerEth) public {
        var mappedOrderId = droneOrderMapping[droneId];
        require(mappedOrderId >= 0);
        Order currentOrder = orderDetails[mappedOrderId - salt];
        require(currentOrder.orderId >= 0);
        require(Status.Open == currentOrder.status);
        address refundTo = currentOrder.senderEthAccount;
        currentOrder.status = Status.Closed;
        refundTo.transfer(currentOrder.transactionPrice);
        OrderReverted(mappedOrderId, consumerEth);
    }

    function getOrderDetails() public returns(Order[] orderDetails) {
        return orderDetails;
    }
    function () payable {
        
    }
    
    function destroy() public ownerAction {
        selfdestruct(owner);
    }

}