const { v4 }  = require('uuid')

class Warehouse {
  constructor(name, address, location) {
    this.id = v4();
    this.name = name;
    this.location = location;
    this.address = address;
    this.inventory = {}; // {itemId: quantity}
    this.distance = null; // needs to be removed
  }
}

class Item {
  constructor(name, quantity, imageURL) {
    this.warehouseIDs = new Set();
    this.id = v4();
    this.name = name;
    this.quantity = quantity;
    this.imageURL = imageURL ? imageURL : "";
    this.batches = []; // FIFO queue implemented as a list since popping first element in JS is pretty efficient
  }
}

class ItemBatch {
  constructor(name, itemId, quantity, warehouseID) {
    this.name = name;
    this.itemId = itemId;
    this.batchId = v4();
    this.quantity = quantity;
    this.warehouseID = warehouseID;
    this.dateAdded = new Date();
  }
}

module.exports = { Warehouse, Item, ItemBatch }
