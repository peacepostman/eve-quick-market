function getData(type: string = "systems") {
  const storage = localStorage.getItem("eve_" + type);
  if (storage) {
    return JSON.parse(storage);
  } else {
    return [];
  }
}

export default getData;
