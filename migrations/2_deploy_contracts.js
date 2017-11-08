var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var DroneDrops = artifacts.require("./DroneDrops.sol");
var Transaction = artifacts.require("./Transaction.sol");
var OwnerAction = artifacts.require("./OwnerAction.sol");


module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(DroneDrops);
  deployer.deploy(Transaction);
  deployer.deploy(OwnerAction);
};
