pragma solidity >=0.4.21 <0.6.0;

/**
 * @title InventoryManager
 * @author Juan Carlos Arocha (https://github.com/jcao02)
 * @dev This contract should only handle the inventory CRUD and ownership
 */
contract InventoryManager {
  struct Inventory {
    uint256 id;
    string name;
    string description;
  }

  uint256 private INVENTORY_COUNTER = 0;
  Inventory[] public inventories;
  mapping(uint256 => address) public inventoryToOwner;

  event InventoryCreated(address indexed owner, uint256 id, string name, string description);

  /**
   * @dev this function will modify the public inventories variable and also set ownership in inventoryToOwner
   * The INVENTORY_COUNTER is used as a serial id sequence, so it's incremented in this function as well.
   *
   * Maybe is not a big problem for now, but we should handle concurrency in the ID generation
   */
  function createInventory(string calldata _name, string calldata _description) external {
    uint256 id = INVENTORY_COUNTER++;
    Inventory memory inventory = Inventory(id, _name, _description);
    inventories.push(inventory);
    inventoryToOwner[inventory.id] = msg.sender;

    emit InventoryCreated(msg.sender, id, _name, _description);
  }
}
