import { isArray } from "lodash";

function setData(
  type: string = "systems",
  data: any,
  noArray: boolean = false
) {
  if (!isArray(data) && !noArray) {
    data = [data];
  }
  localStorage.setItem("eve_" + type, JSON.stringify(data));
  return data;
}

export default setData;
