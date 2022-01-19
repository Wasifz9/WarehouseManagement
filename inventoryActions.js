export function insertItemBatch(
	itemName,
	quantity,
	warehouseID,
	warehousesById,
	itemById,
	itemBatchById,
	setWarehouseById,
	setItemById,
	setItemBatchById
      ) {
	const itemBatchObj = new ItemBatch(itemName, null, quantity, warehouseID);
	// Update warehouse inventory
	try {
	  const warehouse = warehousesById[itemBatchObj.warehouseID];
	  if (!warehouse) {
	    throw new Error("Warehouse not found");
	  }
      
	  if (
	    itemBatchObj.itemId in warehousesById[itemBatchObj.warehouseID].inventory
	  ) {
	    warehousesById[itemBatchObj.warehouseID].inventory[itemBatchObj.itemId] +=
	      itemBatchObj.quantity;
	  } else {
	    warehousesById[itemBatchObj.warehouseID].inventory[itemBatchObj.itemId] =
	      itemBatchObj.quantity;
	  }
	  setWarehouseById({ ...warehousesById });
      
	  // Update global item quantity
	  if (itemBatchObj.itemId && itemBatchObj.itemId in itemById) {
	    itemById[itemBatchObj.itemId].quantity += itemBatchObj.quantity;
	    itemById[itemBatchObj.itemId].warehouseIDs.add(itemBatchObj.warehouseID);
	  } else {
	    const item = new Item(itemBatchObj.name, itemBatchObj.quantity);
	    item.warehouseIDs.add(itemBatchObj.warehouseID);
	    itemById[item.id] = item;
	  }
      
	  setItemById({ ...itemById });
      
	  // Update itemBatchById
	  itemBatchById[itemBatchObj.batchId] = itemBatchObj;
	  setItemBatchById({ ...itemBatchById });
	} catch (e) {
	  console.log("Error inserting item batch", e);
	}
      }