const InventoryManager = artifacts.require('InventoryManager');

module.exports = function(deployer) {
  deployer.deploy(InventoryManager);
};
