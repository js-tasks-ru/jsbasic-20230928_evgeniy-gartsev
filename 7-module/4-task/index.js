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
    this._sliderProgress = this.elem.querySelector(".slider__progress");
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
    this.elem.addEventListener("click", (event) => {
      const step = this.findStep(event.clientX);
      const percentLeft = (step * 100) / (this._steps - 1);
      this.onPointerClick(percentLeft, step);
      this.dispatchSliderEvent(step);
    });

    this._thumb.addEventListener("pointerdown", (event) => {
      const onPointerMoveFunc = this.onPointerMove.bind(this);
      event.preventDefault();
      this._thumb.ondrugstart = () => false;

      document.addEventListener("pointermove", onPointerMoveFunc);

      document.addEventListener("pointerup", event => {
        const step = this.findStep(event.clientX);
        document.removeEventListener("pointermove", onPointerMoveFunc);
        this._thumb.onpointerup = null;
        this.elem.classList.remove("slider_dragging");
        this.dispatchSliderEvent(step);
      });
    });
  }

  relativeX(clientX) {
    return clientX - this.elem.getBoundingClientRect().left;
  }

  findStep(clientX) {
    let relativeX = this.relativeX(clientX);
    let segments = this._steps - 1;
    let step = Math.round((relativeX * segments) / this.elem.offsetWidth);
    return step > segments ? segments : step;
  }

  leftToPercent(clientX) {
    let relation = this.relativeX(clientX) / this.elem.offsetWidth;
    relation = relation < 0 ? 0 : relation;
    relation = relation > 1 ? 1 : relation;

    return relation * 100;
  }

  onPointerClick(percent, step) {
    Array.from(this._spans).forEach((s) => {
      s.classList.remove("slider__step-active");
    });

    this._spans[step].classList.add("slider__step-active");
    this._thumb.querySelector(".slider__value").textContent = step;
    this._thumb.style.left = percent + "%";
    this._sliderProgress.style.width = percent + "%";
  }

  onPointerMove(event) {
    this.elem.classList.add("slider_dragging");
    const step = this.findStep(event.clientX);
    const percentLeft = this.leftToPercent(event.clientX);
    this.onPointerClick(percentLeft, step);
  }

  dispatchSliderEvent(step) {
    const sliderChange = new CustomEvent('slider-change', {
      detail: step,
      bubbles: true
    });
    this.elem.dispatchEvent(sliderChange);
  }
}
