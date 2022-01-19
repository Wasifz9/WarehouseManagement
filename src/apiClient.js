export async function perform(method, resource, data) {
  const BASE_URI = process.env.REACT_APP_BACKEND_URL;
  const accessToken = sessionStorage.getItem("access_token");
  try {
    let reqParams;
    if (method === "post" || method === "put") {
      reqParams = {
        method: method,
        credentials: "include",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      };
    } else {
      reqParams = {
        method: method,
        credentials: "include",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Authorization: `Bearer ${accessToken}`,
        },
      };
    }

    let res = await fetch(`${BASE_URI}${resource}`, reqParams);

    if (res.status !== 200) {
      throw new Error("authentication has been failed!");
    }
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function invalidateToken() {
  const result = await perform("get", `/auth/logout`);
  return result.success;
}

export async function addWarehouse(address, location){
  const data = {
    location: location,
    address: address
  }
  return await perform("post", '/addwarehouse', data) 
}

export async function addItemBatch(warehouseID, itemName,  newQuantity){
  const data = {
    warehouseID: warehouseID,
    itemName: itemName,
    newQuantity: newQuantity
  }
  return await perform ("post", '/additembatch', data)
}


export async function updateWarehouseItemQuantiy(warehouseID, itemID,  newQuantity){
  const data = {
    warehouseID: warehouseID,
    itemID: itemID,
    newQuantity: newQuantity
  }

  return await perform ("post", '/updatewarehouse', data)
}

