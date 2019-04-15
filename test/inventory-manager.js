const faker = require('faker');
const truffleAssert = require('truffle-assertions');
const InventoryManager = artifacts.require('InventoryManager');

/**
 * Returns an array of Inventory from a createInventory transaction
 * @param {Transaction} tx where the inventories are stored. This should be a transaction
 * from calling createInventory function
 */
function getInventoriesFromTransaction(tx) {
  const eventName = 'InventoryCreated';
  // First get the proper events
  const logs = tx.logs.filter(log => log.event === eventName);
  // Return inventories from event args
  return logs.map(log => ({ id: log.args.id, name: log.args.name, description: log.args.description }));
}

contract('InventoryManager', async accounts => {
  let manager;
  beforeEach(async () => {
    manager = await InventoryManager.deployed();
  });
  describe('createInventory', () => {
    it('should create a new inventory', async () => {
      const name = faker.lorem.word();
      const description = faker.lorem.sentence();
      await manager.createInventory(name, description);

      /**
       * Solc creates a getter function for public properties.
       * For arrays, it receives the index of the element and returns the element.
       */
      const inventory = await manager.inventories(0);
      assert.equal(inventory.name, name);
      assert.equal(inventory.description, description);
    });

    it('should emit InventoryCreated event with proper arguments', async () => {
      const name = faker.lorem.word();
      const description = faker.lorem.sentence();
      const senderAcc = accounts[1];
      const tx = await manager.createInventory(name, description, { from: senderAcc });

      // Ref: https://github.com/rkalis/truffle-assertions#truffleasserteventemittedresult-eventtype-filter-message
      truffleAssert.eventEmitted(tx, 'InventoryCreated', (ev) =>
        ev.name === name && ev.description === description && ev.owner === senderAcc
      );
    });

    it('should associate the inventory ownership to its sender', async () => {
      const name = faker.lorem.word();
      const description = faker.lorem.sentence();
      const senderAcc = accounts[1];
      const tx = await manager.createInventory(name, description, { from: senderAcc });

      const inventories = getInventoriesFromTransaction(tx);
      const inventoryId = inventories[0].id;
      /**
       * In the case of mapping, the getter solc creates takes the mapping
       * index and returns the element.
       */
      const owner = await manager.inventoryToOwner(inventoryId);
      assert.equal(owner, senderAcc);
    });
  });
});
