function checkSpam(str) {
  if (str) {
    let lowerCaseString = str.toLowerCase();
    if (lowerCaseString.includes('1xbet') || lowerCaseString.includes('xxx')) {
      return true;
    }
  }
  return false;
}
