import { Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import Fuse from 'fuse.js'
import Autocomplete from '@mui/material/Autocomplete';

import ItemComponent from "./ItemComponent";
import {
  addItemBatch,
  addWarehouse,
  updateItemQuantityInAWarehouse,
  getItem,
  getItemBatch,
  getItems, 
  getWarehouses
} from "./apiCaller";

export default function Dashboard() {

  const [itemName, setItemName] = useState("");
  const [selectedItem, setSelectedItem] = useState('');
  const [searchItemID, setSearchItemID] = useState('')
  const [warehouseID, setwarehouseID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notificaton, setNotification] = useState(null);
  const [address, setAddress] = useState("");
  const [masterItemList, setMasterItemList] = useState([])
  const [masterWarehouseList, setMasterWarehouseList] = useState([])
  const [fuse, setFuse] = useState('')
  const [matchList, setMatchList] = useState([])
  const [itemsDic, setItemsDic] = useState({})
  const [whDic, setWHDic] = useState({})

  const setNewItems = async () => { 
    const items = await getItems(setNotification)
    setItemsDic(items)
    var tempMasterList = []
    for (const [key, value] of Object.entries(items)){
      tempMasterList.push(key)
    } 
    setMasterItemList(tempMasterList);
  }

  const setNewWarehouseList = async () => {
    const wh = await getWarehouses(setNotification)
    setWHDic(wh)
    var tempMasterList = []
    for (const [key, value] of Object.entries(wh)){
      tempMasterList.push(value)
    } 
    setMasterWarehouseList(tempMasterList)
  }

  useEffect(() => {
    async function initializeMasterLists() { 
      setNewItems()
      setNewWarehouseList()     
    }
    initializeMasterLists()
  }, []);


  const handleSearchIDChange = (event) => {
    setSearchItemID(event.target.value);
    var results = fuse.search(itemName)
    var newResults = results.map((result) => result.item);
    setMatchList(newResults)   
  };

  const handleNameChange = (event) => {
    setItemName(event.target.value);
    fuse.search(itemName)
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };
  const handlewarehouseIDChange = (event) => {
    setwarehouseID(parseInt(event.target.value));
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const searchItem = async () => {
    var retrievedItem = await getItem(itemName, setNotification);
    retrievedItem && setSelectedItem(retrievedItem);
  };

  const addWarehouseHandler = async () => {
    await addWarehouse(address, setNotification)
    const wh = await getWarehouses(setNotification)
    console.log(wh)
    var tempMasterList = []
    for (const [key, value] of Object.entries(wh)){
      tempMasterList.push(value)
    } 
    setMasterWarehouseList(tempMasterList)
  }

  const itemClickHandler = async (itemName) => { 
    const item = await getItem(itemsDic[itemName], setNotification)
    console.log(item)
    setSelectedItem(item)
  }

  const newBatchHandler = async() => {
    await addItemBatch(warehouseID, itemName, null, quantity, setNotification)
    setNewItems()
  } 

  return (
    <div className="dashboard-container">
      {notificaton && (
        <Snackbar
          style={{
            position: "fixed",
            "max-height": "fit-content",
            "min-width": "15vw",
            top: "5vh",
            left: "30vw",
          }}
          open={notificaton.message}
          autoHideDuration={4000}
          onClose={() => setNotification(null)}
        >
          <Alert
            severity={notificaton.type}
            onClose={() => setNotification(null)}
          >
            {notificaton.message}
          </Alert>
        </Snackbar>
      )}

      <div className="search-div">
        <Typography variant="h4" my={2}>
          Inventory Management
        </Typography>
        <div>
          <TextField
            style={{ margin: "5px" }}
            type="text"
            label="search"
            variant="outlined"
            onChange={handleSearchIDChange}
            value={searchItemID}
          />
          {/* <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={masterItemList}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Items" />}
          /> */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => searchItem()}
          >
            Search Item
          </Button>
        </div>
      </div>
      <div className="content-view">
        <div className="item-viewer">
          <div className="item-viewer-container" style={{flexDirection:'column'}}>
            <div className="item-results">  
            <Typography variant ={'h4'}>
              Available Items
            </Typography>
              {masterItemList && masterItemList.map((itemName, index) => (              
                  <div onClick={() => itemClickHandler(itemName)}> {itemName} </div>
              ))} 
            </div>
            <div className="item-preview">
              {selectedItem ? 
                <ItemComponent
                  itemId={selectedItem.id}
                  name={selectedItem.name}
                  quantity={12}
                />
                :
                <Typography variant={'h5'}> 
                    Select an item to view information
                </Typography>
              }
            </div>
          </div>
          <div className="item-viewer-container">
            <div className="warehouse-list">
              <Typography variant="h6" m={2}>
                Item batches
              </Typography>
              {selectedItem && selectedItem.batches.map((batch) => {
                <p> {batch} </p>
              })}
            </div>
            <div className="warehouse-list">
              <Typography variant="h6" m={2}>
                Waehouses with item in stock
              </Typography>
              {selectedItem && selectedItem.warehouses.map((warehouse) => {
                <p> {warehouse} </p>
              })}
            </div>
          </div>
        </div>

        <div className="control-view">
          <div className="item-control">
            <Typography variant="h6" my={2}>
              Add Item Batch
            </Typography>
            <TextField
              style={{ margin: "5px" }}
              type="text"
              label="name"
              variant="outlined"
              onChange={handleNameChange}
              value={itemName}
            />

            <TextField
              style={{ margin: "5px" }}
              type="text"
              label="quantity"
              variant="outlined"
              onChange={handleQuantityChange}
              value={quantity}
            />

            <TextField
              style={{ margin: "5px" }}
              type="text"
              label="warehouseID"
              variant="outlined"
              onChange={handlewarehouseIDChange}
              value={warehouseID}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                newBatchHandler() 
              }
            >
              + Batch
            </Button>
          </div>

          <div className="warehouse-view">
            <div className="warehouse-control">
              <Typography variant="h6">Warehouses</Typography>
              <TextField
                style={{ margin: "10px" }}
                type="text"
                label="warehouse address"
                variant="outlined"
                onChange={handleAddressChange}
                value={address}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {addWarehouseHandler()}}
              >
                + Warehouse
              </Button>
            </div>
            <div className="warehouse-list">
              {masterWarehouseList && masterWarehouseList.map((warehouse, index) => (              
                  <div> {index}: {warehouse.address}</div>
              ))} 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
