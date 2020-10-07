import { isArray } from "lodash";

function setData(type: string = "systems", data: any) {
  console.log("data", data);
  if (!isArray(data)) {
    data = [data];
  }
  localStorage.setItem("eve_" + type, JSON.stringify(data));
  return data;
}

export default setData;
