const { Item, ItemBatch, Warehouse } = require("./schema");

// Warehouses
const farthestWareHouse = new Warehouse(7, "farthestWareHouse", "123 Main St", {
  longitute: 43.65516733516912,
  latitude: -79.43054855252032,
});
const secondClosestWareHouse = new Warehouse(
  8,
  "secondClosestWareHouse",
  "12543 Fort St",
  { longitute: 43.65104366699908, latitude: -79.3906793523954 }
);
const closestWareHouse = new Warehouse(9, "closestWareHouse", "1 Baby St", {
  longitute: 43.63729881158868,
  latitude: -79.39599249915359,
});

var itemByID = {}; //{itemID: Item, ...}
var itemBatchByID = {}; //{id: ItemBatch, ...}
var warehouseByID = {
  7: farthestWareHouse,
  8: secondClosestWareHouse,
  9: closestWareHouse,
}; //{id: Warehouse, ...}

function insertItemBatch() {
  return async (req, res) => {
    try {
      var { warehouseID, itemName, itemID, newQuantity } = req.body;

      // Update global item quantity
      let item = itemByID[itemID];
      if (!item) {
        // If no item exists in database, create a new one
        item = new Item(itemName, newQuantity);
        item.warehouseIDs.add(warehouseID);
      
      } else {
        item.quantity += newQuantity;
        item.warehouseIDs.add(warehouseID);
      }
      
      itemByID[item.id] = item;

      // Update itemBatchByID
      const itemBatchObj = new ItemBatch(
        itemName,
        item.id,
        newQuantity,
        warehouseID
      );

      itemBatchByID[itemBatchObj.batchId] = itemBatchObj;
      
      // Update warehouse inventory
      const warehouse = warehouseByID[itemBatchObj.warehouseID];
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      if (itemBatchObj.itemID in warehouse.inventory) {
        warehouse.inventory[itemBatchObj.itemID] += itemBatchObj.quantity;
      } else {
        warehouse.inventory[itemBatchObj.itemID] = itemBatchObj.quantity;
      }

      warehouseByID[itemBatchObj.warehouseID] = warehouse;
      console.log(item)

      res.status(200).send("ItemBatch added successfully");
    } catch (error) {
      console.log(`insertItemBatch: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}

function addWarehouse() {
  return async (req, res) => {
    try {
      var { address } = req.body;
      Object.keys(warehouseByID).forEach(function (key) {
        if (warehouseByID[key].address === address) {
          throw new Error("Warehouse already exists");
        }
      });

      const warehouse = new Warehouse(address);

      warehouseByID[warehouse.id] = warehouse;

      res.status(200).send("warehouse added successfully");
    } catch (error) {
      console.log(`addWarehouse: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}


function updateItemQuantityInAWarehouse() {
  return async (req, res) => {
    try {
      var { warehouseID, itemID, newQuantity } = req.body;

      const warehouse = warehouseByID[warehouseID];
      if (!warehouse) {
        throw new Error("Warehouse not found");
      }

      if (!itemID) {
        throw new Error(`ItemID not found in ${warehouse.address}`);
      }
      warehouse.inventory[itemID] = newQuantity;
      warehouseByID[warehouseID] = warehouse;

      res.status(200).send("item quantity updated successfully");
    } catch (error) {
      console.log(`updateItemQuantityInAWarehouse: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}

function getItem() {
  return async (req, res) => {
    try {
      var itemID = req.query.id;
      const item = itemByID[itemID];
      if (!item) {
        throw new Error("Item not found");
      }
      res.status(200).send(item);
    } catch (error) {
      console.log(`getItem: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}


function getItems() {
  return async (req, res) => {
    try {
      let items = {};
      // get entries from warehouseByID
      Object.entries(itemByID).forEach(([key, item]) => {
        items[item.name] = key;
      });
      res.json(items);
    } catch (error) {
      console.log(`getItems: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}

function getWarehouses() {
  return async (req, res) => {
    try {
      console.log(warehouseByID)
      res.json(warehouseByID);
    } catch (error) {
      console.log(`getItems: ${error}`);
      // return response message, warehouse not found
      res.status(400).json({
        message: error.message,
      });
    }
  };
}

module.exports = {
  insertItemBatch,
  getItem,
  addWarehouse,
  updateItemQuantityInAWarehouse,
  getItems, 
  getWarehouses
};
