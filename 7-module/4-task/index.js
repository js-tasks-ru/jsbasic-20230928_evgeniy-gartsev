import createElement from "../../assets/lib/create-element.js";
export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._steps = steps;
    this._value = value;
    this._initThumbOffset = (value * 100) / (steps - 1);
    this.elem = createElement(`
    <div class="slider">
    <div class="slider__thumb" style="left: ${this._initThumbOffset}%;">
      <span class="slider__value">${this._initThumbOffset}</span>
    </div>

    <div class="slider__progress" style="width: ${this._initThumbOffset}%;"></div>

    <div class="slider__steps">
      ${this.stepsSpan}
    </div>
  </div>
    `);

    this._thumb = this.elem.querySelector(".slider__thumb");
    this._spans = this.elem.querySelectorAll(".slider__steps span");
    this.addEvents();
  }

  get stepsSpan() {
    let result = [];
    for (let i = 0; i < this._steps; i++) {
      const span = document.createElement("span");
      if (i == this._value) {
        span.classList.add("slider__step-active");
      }
      result.push(span.outerHTML);
    }
    return result.join("");
  }

  addEvents() {
    this.elem.addEventListener("click", event => {
      const step = this.findStep(event.clientX, event.clientY);
      this.applyStep(step);
    });

    this._thumb.addEventListener("pointerdown", event => {
      event.preventDefault();
      this.ondrugstart = () => false;

      const shiftX = event.clientX - this._thumb.getBoundingClientRect().left;
      let onPointerMoveFunc = onPointerMove.bind(this);

      document.addEventListener("pointermove", onPointerMoveFunc);
      document.addEventListener("pointerup", (event) => {
        const step = this.findStep(event.clientX, event.clientY);
        this.elem.classList.remove("slider_dragging");
        const thumbOffset = (step * 100) / (this._steps - 1);
        this._thumb.style.left = `${thumbOffset}%`;

        document.removeEventListener("pointermove", onPointerMoveFunc);
        document.onpointerup = null;
      });

      function onPointerMove(event) {
        let marginLeft = parseInt(getComputedStyle(this._thumb).marginLeft);
        let left = this.coordsRelativeSlider(event.clientX, event.clientY).left - marginLeft - shiftX;

        left = left < 0 ? 0 : left;
        left = left + this._thumb.offsetWidth / 2 + marginLeft > this.elem.offsetWidth ? this.elem.offsetWidth : left;

        this._thumb.style.left = left + "px";
        this.elem.classList.add("slider_dragging");
        const step = this.findStep(event.clientX, event.clientY);
        this.applyStep(step, false);
      }
    });
  }

  findStep(clientX, clientY) {
    let coordLeftRelativeSlider = this.coordsRelativeSlider(clientX, clientY).left;
    let currentSegment = this.segmentWidth / 2;

    for (let i = 0; i < this._steps; i++) {
      if (coordLeftRelativeSlider < currentSegment) {
        return i;
      }
      currentSegment += this.segmentWidth;
    }
  }

  applyStep(step, isMoveSlider = true) {
    const sliderProgress = this.elem.querySelector(".slider__progress");
    const thumbOffset = (step * 100) / (this._steps - 1);
    const sliderChangeEvent = new CustomEvent("slider-change", {
      detail: step,
      bubbles: true,
    });


    Array.from(this._spans).forEach(span => {
      span.classList.remove("slider__step-active");
    });

    this._spans[step].classList.add("slider__step-active");

    this._thumb.querySelector(".slider__value").textContent = step;

    sliderProgress.style.width = `${thumbOffset}%`;
    this.elem.dispatchEvent(sliderChangeEvent);

    if (isMoveSlider) {
      this._thumb.style.left = `${thumbOffset}%`;
    }
  }

  coordsRelativeSlider(clientX, clientY) {
    return {
      left: clientX - this.elem.getBoundingClientRect().left,
      top: clientY - this.elem.getBoundingClientRect().top
    };
  }

  get segmentWidth() {
    return this._spans.length > 1 ?
      (this._spans[1].getBoundingClientRect().left - this._spans[0].getBoundingClientRect().left) : 0;
  }
}
