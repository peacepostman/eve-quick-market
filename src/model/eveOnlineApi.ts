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
    return axios
      .get(
        `search/?categories=${categorie}&datasource=tranquility&language=en-us&strict=false&search=${itemName}`,
        axiosOptions
      )
      .catch((err) => null);
  }

  static getStation(stationID: string) {
    return axios
      .get(
        `universe/stations/${stationID}/?datasource=tranquility`,
        axiosOptions
      )
      .catch((err) => null);
  }

  static getItem(itemID: string) {
    return axios
      .get(`universe/types/${itemID}/?datasource=tranquility`, axiosOptions)
      .catch((err) => null);
  }

  static getMarketOrder(
    regionID: string,
    typeID: string,
    orderType: string = "sell",
    page: string = "1"
  ) {
    return axios
      .get(
        `markets/${regionID}/orders/?datasource=tranquility&order_type=${orderType}&page=${page}&type_id=${typeID}`,
        axiosOptions
      )
      .catch((err) => null);
  }

  static getMarketHistory(regionID: string, typeID: string) {
    return axios
      .get(
        `markets/${regionID}/history/?datasource=tranquility&type_id=${typeID}`,
        axiosOptions
      )
      .catch((err) => null);
  }

  static getRoute(fromStationID: string, toStationID: string) {
    return axios
      .get(
        `route/${fromStationID}/${toStationID}/?datasource=tranquility&flag=secure`,
        axiosOptions
      )
      .catch((err) => null);
  }
}
