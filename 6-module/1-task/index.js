/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this._rows = rows;
    this.elem = document.createElement("table");

    this.elem.insertAdjacentHTML(
      "afterbegin",
      `<thead><tr>${this.headRows}</tr></thead>`
    );

    this.elem.insertAdjacentHTML(
      "beforeend",
      `<tbody>${this.bodyRows}</tbody>`
    );

    this._addEvents();
  }

  get headRows() {
    let headRows = ["Имя", "Возраст", "Зарплата", "Город"]
      .map((e) => {
        return `<th>${e}</th>`;
      })
      .join("");
    return headRows;
  }

  get bodyRows() {
    let bodyRows = this._rows
      .map((e) => {
        let row = `<tr>
      <td>${e.name}</td>
      <td>${e.age}</td>
      <td>${e.salary}</td>
      <td>${e.city}</td>
      <td><button>X</button></td>
    </tr>`;
        return row;
      })
      .join("");
    return bodyRows;
  }

  _addEvents() {
    this.elem.addEventListener("click", (event) => {
      if (event.target.tagName == "BUTTON") {
        event.target.closest("TR").remove();
      }
    });
  }
}
