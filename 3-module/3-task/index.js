function camelize(str) {
  return str
    .split("-")
    .map((item, index) => {
      return index > 0 ? item[0].toUpperCase() + item.slice(1) : item;
    })
    .join("");
}
