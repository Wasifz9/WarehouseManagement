const express = require("express");
const cors = require('cors');
const app = express();
const port = 8080;
const { Warehouse } = require('./src/schema')

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

const itemById = {}; //{itemId: Item, ...}
const itemBatchById = {}; //{id: ItemBatchx, ...}

const warehousesById = {
  7: farthestWareHouse,
  8: secondClosestWareHouse,
  9: closestWareHouse,
}; //{id: Warehouse1} // Need to be ptr to warehouse object};

app.use(cors());

var whitelist = [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Cors error!")
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.send("Inventory Server is Running!");
});

app.post("/addwarehouse", (req, res) => {
  res.send("Hello World!");
});

app.post("/updatewarehouse", (req, res) => {	
  res.send("Hello World!");
});

app.post("/additembatch", (req, res) => {
  var {warehouseID, itemName, newQuantity } = req.body


  res.send("Hello World!");
  console.log('itemBatchAdded')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
