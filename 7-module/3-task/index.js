import createElement from "../../assets/lib/create-element.js";
export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.initThumbOffset = (value * 100) / (steps - 1);
    this.elem = createElement(`
    <div class="slider">
    <div class="slider__thumb" style="left: ${this.initThumbOffset}%;">
      <span class="slider__value">${this.initThumbOffset}</span>
    </div>

    <div class="slider__progress" style="width: ${this.initThumbOffset}%;"></div>

    <div class="slider__steps">
      ${this.stepsSpan}
    </div>
  </div>
    `);

    this.addEvents();
  }

  get stepsSpan() {
    let result = [];
    for (let i = 0; i < this.steps; i++) {
      const span = document.createElement("span");
      if (i == this.value) {
        span.classList.add("slider__step-active");
      }
      result.push(span.outerHTML);
    }
    return result.join("");
  }

  addEvents() {
    this.elem.addEventListener("click", (event) => {
      const spans = this.elem.querySelectorAll(".slider__steps span");

      let coordRelativeSlider = event.clientX - this.elem.getBoundingClientRect().left;
      let segmentWidth = spans[1].getBoundingClientRect().left - spans[0].getBoundingClientRect().left;
      let currentSegment = segmentWidth / 2;

      for (let i = 0; i < this.steps; i++) {
        if (coordRelativeSlider < currentSegment) {
          Array.from(spans).forEach((e) => {
            e.classList.remove("slider__step-active");
          });
          spans[i].classList.add("slider__step-active");

          const thumb = this.elem.querySelector(".slider__thumb");
          const sliderProgress = this.elem.querySelector(".slider__progress");
          thumb.querySelector(".slider__value").textContent = i;

          let thumbOffset = (i * 100) / (this.steps - 1);
          thumb.style.left = `${thumbOffset}%`;
          sliderProgress.style.width = `${thumbOffset}%`;

          const sliderChangeEvent = new CustomEvent("slider-change", {
            detail: i,
            bubbles: true,
          });

          this.elem.dispatchEvent(sliderChangeEvent);

          break;
        }

        currentSegment += segmentWidth;
      }
    });
  }
}
