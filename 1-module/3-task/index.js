function ucFirst(str) {
  if (str) {
    let firstLetter = str[0].toUpperCase();
    return str.length > 1 ? firstLetter + str.slice(1) : firstLetter;
  }
  return str;
}
