# Contracts

This file describes the contracts used within the Dapp.

## InventoryManager

This is a stateful contract that handle the inventories management. It stores:
1. An array of all inventories.
2. A mapping `inventoryId` => `owner` to see who owns which inventory.

Among its responsabilities:
1. Create new inventories.
2. Modify existing inventories.
3. Delete existing inventories.
4. List all inventories (only contract owner).
5. List inventories by owner (only inventories' owner).
