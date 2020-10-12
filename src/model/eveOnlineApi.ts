import axios from "axios";

const axiosOptions: any = {
  baseURL: "https://esi.evetech.net/latest/",
  method: "get",
  headers: {
    accept: "application/json",
    "Accept-Language": "en-us",
  },
};

export default class EveOnlineAPI {
  static search(
    itemName: string,
    categorie: "inventory_type" | "station" | "region" | "solar_system"
  ) {
    return axios.get(
      `search/?categories=${categorie}&datasource=tranquility&language=en-us&strict=false&search=${itemName}`,
      axiosOptions
    );
  }

  static getStation(stationID: string) {
    return axios.get(
      `universe/stations/${stationID}/?datasource=tranquility`,
      axiosOptions
    );
  }

  static getItem(itemID: string) {
    return axios.get(
      `universe/types/${itemID}/?datasource=tranquility`,
      axiosOptions
    );
  }

  static getMarketOrder(
    regionID: string,
    typeID: string,
    orderType: string = "sell"
  ) {
    return axios.get(
      `markets/${regionID}/orders/?datasource=tranquility&order_type=${orderType}&page=1&type_id=${typeID}`,
      axiosOptions
    );
  }

  static getMarketHistory(regionID: string, typeID: string) {
    return axios.get(
      `markets/${regionID}/history/?datasource=tranquility&type_id=${typeID}`,
      axiosOptions
    );
  }

  static getRoute(fromStationID: string, toStationID: string) {
    return axios.get(
      `route/${fromStationID}/${toStationID}/?datasource=tranquility&flag=secure`,
      axiosOptions
    );
  }
}
