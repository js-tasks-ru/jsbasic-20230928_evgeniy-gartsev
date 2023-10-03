function factorial(n) {
  let result = 1;

  if (n <= 1) {
    return result;
  }

  while (n) {
    result *= n;
    n--;
  }

  return result;
}
