function getData(type: string = "systems", noArray: boolean = false) {
  const storage = localStorage.getItem("eve_" + type);
  if (storage) {
    return JSON.parse(storage);
  } else {
    return noArray ? {} : [];
  }
}

export default getData;
