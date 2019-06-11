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

  Inventory[] public inventories;
  mapping(uint256 => address) public inventoryToOwner;

  event InventoryCreated(address indexed owner, uint256 id, string name, string description);

  /**
   * @dev This function will create an inventory with the corresponding
   * name and description, add it to the the public inventories variable,
   * and also set ownership information in the inventoryToOwner variable
   */
  function createInventory(string calldata _name, string calldata _description) external {
    uint256 id = inventories.push(Inventory(0, _name, _description)) - 1;
    inventories[id].id = id;
    inventoryToOwner[id] = msg.sender;
    emit InventoryCreated(msg.sender, id, _name, _description);
  }
}
