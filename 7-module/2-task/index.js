import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.modal = createElement(`
    <div class="modal">
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class="modal__title"></h3>
        </div>
        <div class="modal__body"></div>
      </div>

    </div>
    `);

    this.addEvents();
  }

  open() {
    document.body.insertAdjacentElement("afterbegin", this.modal);
    document.body.classList.add("is-modal-open");
  }

  close() {
    const modal = document.body.querySelector(".modal");
    if (modal) {
      modal.remove();
      document.body.classList.remove("is-modal-open");
      document.removeEventListener("keydown", this.closeByKeyDown);
    }
  }

  setTitle(title) {
    this.modal.querySelector(".modal__title").innerHTML = title;
  }

  setBody(modalBodyContent) {
    const modalBody = this.modal.querySelector(".modal__body");
    modalBody.innerHTML = "";
    modalBody.insertAdjacentElement("afterbegin", modalBodyContent);
  }

  closeByKeyDown(event) {
    if (document.body.classList.contains("is-modal-open") && event.code == "Escape") {
      this.close();
    }
  }

  addEvents() {
    document.addEventListener("click", event => {
      const closeButton = event.target.closest(".modal__close");
      if (closeButton) {
        this.close();
      }
    });

    document.addEventListener("keydown", this.closeByKeyDown.bind(this));

  }
}
