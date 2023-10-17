function highlight(table) {
  const rows = table.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");

    switch (cells[3].dataset.available) {
    case "true":
      row.classList.add("available");
      break;
    case "false":
      row.classList.add("unavailable");
      break;
    case undefined:
      row.hidden = true;
      break;
    }

    switch (cells[2].innerHTML) {
    case "m":
      row.classList.add("male");
      break;
    case "f":
      row.classList.add("female");
      break;
    }

    if (Number(cells[1].innerHTML) < 18) {
      row.style.textDecoration = "line-through";
    }
  });
}

