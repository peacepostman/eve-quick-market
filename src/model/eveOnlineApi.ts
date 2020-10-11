import axios from "axios";

const BASE_URL = "https://esi.evetech.net/latest/";
const axiosOptions: any = {
  method: "get",
  headers: {
    accept: "application/json",
    "Accept-Language": "en-us",
  },
};

export default class EveOnlineAPI {
  static searchStation(stationName: string) {
    return axios.get(
      `${BASE_URL}search/?categories=station&datasource=tranquility&language=en-us&strict=false&search=${stationName}`,
      axiosOptions
    );
  }

  static getStation(stationID: string) {
    return axios.get(
      `${BASE_URL}universe/stations/${stationID}/?datasource=tranquility`,
      axiosOptions
    );
  }

  static searchItem(itemName: string) {
    return axios.get(
      `${BASE_URL}search/?categories=inventory_type&datasource=tranquility&language=en-us&strict=false&search${itemName}`,
      axiosOptions
    );
  }

  static getItem(itemID: string) {
    return axios.get(
      `${BASE_URL}universe/types/${itemID}/?datasource=tranquility`,
      axiosOptions
    );
  }

  static marketSellOrder(regionID: string, typeID: string) {
    return axios.get(
      `${BASE_URL}markets/${regionID}/orders/?datasource=tranquility&order_type=sell&page=1&type_id=${typeID}`,
      axiosOptions
    );
  }

  static marketHistory(regionID: string, typeID: string) {
    return axios.get(
      `${BASE_URL}markets/${regionID}/history/?datasource=tranquility&type_id=${typeID}`,
      axiosOptions
    );
  }
}
