import React, { useEffect } from "react";
import "./App.css";
import { Item, ItemBatch, Warehouse } from "./schema";
import { insertItemBatch, onItemClick } from "./utils";
import { Button, TextField, select } from "@mui/material";
import { useState } from "react";
import { addWarehouse, addItemBatch, updateWarehouseItemQuantiy} from './apiClient.js'
import NewItemBatchForm from "./NewItemBatchForm";

function syntaxHighlight(json) {
  if (typeof json != "string") {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}


// Items
const pencil = new Item(1, "pencil", 200);
const eraser = new Item(2, "eraser", 200);
const notebook = new Item(3, "notebook", 200);

// batches
const pencilBatch = new ItemBatch("pencil", null, 50, 7);
const eraserBatch = new ItemBatch("eraser", null, 50, 7);
const notebookBatch = new ItemBatch("notebook", null, 50, 7);

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

const itemz = {}; //{itemId: Item, ...}
const itemBatchez = {}; //{id: ItemBatchx, ...}

const warehousez = {
  7: farthestWareHouse,
  8: secondClosestWareHouse,
  9: closestWareHouse,
}; //{id: Warehouse1} // Need to be ptr to warehouse object};

function App() {

  const [item, setItem] = useState({
    id: '',
    quantity: 0, 
    itemName: '',
    batches: [], 
    warehouses: []
  })

  const [itemBatch, setItemBatch] = useState({
    id: '',
    name: '',
    quantity: 0, 
    warehouse:'',
    dateAdded:'' 
  })
  
  const [newWarehouse, setNewWarehouse ] = useState({
    id: '',
    address:'',
    //maxQuantity: 0, 
  })


  
  const [itemName, setItemName] = useState("");
  const [warehouseID, setwarehouseID] = useState('');
  const [globalQuantity, setGlobalQuantity] = useState(0);
  const [warehouseItemQuanity, setWarehouseItemQuantity] = useState(0)
  const [batchQuantity, setBatchQuantity] = useState(0)
  const [batchID, setBatchID] = useState(0)
  const [warehousesById, setWarehouseById] = useState(warehousez);
  const [itemById, setItemById] = useState(itemz);
  const [itemBatchById, setItemBatchById] = useState(itemBatchez);

  const handleNameChange = (event) => {
    // setItem({
    //   ...item, 
    //   name: event.target.value 
    // })
    setItemName(event.target.value)
  };

  const handleQuantityChange = (event) => {


    // setQuantity(parseInt(event.target.value));
  };

  const handlewarehouseIDChange = (event) => {
    // setwarehouseID(parseInt(event.target.value));
  };

  useEffect(() => {
    document.getElementById(1).innerHTML = syntaxHighlight(warehousesById);
    document.getElementById(2).innerHTML = syntaxHighlight(itemById);
    document.getElementById(3).innerHTML = syntaxHighlight(itemBatchById);
    console.log(itemById);
  }, [warehousesById, itemById, itemBatchById]);


  const handleNewItemBatch = async () => { 
    await addItemBatch(itemBatch.warehouseID, itemBatch.name, itemBatch.quantity)  
  }

  // const handleNewWarehouse = async () => {
  //   await addWarehouse(address, locaton)
  // }

  // const handlUpdateWarehouseItemQuantity = async () => { 
  //   await updateWarehouseItemQuantity(warehouseID, itemID,  )
  // }

  return (
    <div className="App">
      <div>
        <form>
          <TextField
            style={{ width: "200px", margin: "5px" }}
            type="text"
            label="name"
            variant="outlined"
            onChange={handleNameChange}
            value={itemName}
          />
          <br />
          <TextField
            style={{ width: "200px", margin: "5px" }}
            type="text"
            label="quantity"
            variant="outlined"
            onChange={handleQuantityChange}
            value={itemBatch.quantity}
          />
          <br />
          <TextField 
            style={{ width: "200px", margin: "5px" }}
            type="text"
            label="warehouseID"
            variant="outlined"
            onChange={handlewarehouseIDChange}
            value={itemBatch.warehouseID}
          />
          <br />

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNewItemBatch()}
          >
            Register item batch
          </Button>
          
        </form>
      </div>
      <NewItemBatchForm handleNameChange={handleNameChange} />
      <div>
        <pre id="1" />
        <pre id="2" />
        <pre id="3" />
      </div>
    </div>
  );
}

export default App;
