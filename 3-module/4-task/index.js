function showSalary(users, age) {
  return users
    .reduce((accum, item) => {
      if (item.age <= age) {
        accum.push(`${item.name}, ${item.balance}`);
      }
      return accum;
    }, [])
    .join("\n");
}
