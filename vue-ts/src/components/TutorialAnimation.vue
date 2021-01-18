<template>
  <svg
    viewBox="11.8 9 16 22"
    id="mouse"
    ref="mouse"
    :style="`transition: transform ${transitionTimeMs / 1000}s;`"
    class="mouse"
  >
    <path d="M20,21l4.5,8l-3.4,2l-4.6-8.1L12,29V9l16,12H20z"></path>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<TutorialAnimation>({})
export default class TutorialAnimation extends Vue {
  @Prop({ required: true })
  steps: Array<string>;

  mouse: HTMLElement = null;
  currentStep = 0;
  transitionTimeMs = 1000;
  animationIntervalMs = 1500;
  waitBeforeClickMs = 500;

  mounted() {
    if (this.steps === null) {
      this.$emit("finished");
      return;
    }
    this.mouse = this.$refs["mouse"] as HTMLElement;
    this.centerMouse();
    setTimeout(
      () => requestAnimationFrame(this.animate),
      this.animationIntervalMs
    );
  }

  centerMouse() {
    this.mouse.style.left = `${window.innerWidth / 2}px`;
    this.mouse.style.top = `${window.innerHeight / 2}px`;
  }

  animate() {
    if (this.currentStep >= this.steps.length) {
      this.$emit("finished");
      return;
    }
    const step = this.steps[this.currentStep];
    let id: string;
    let value: string;
    if (step.includes(":")) {
      id = step.split(":")[0];
      value = step.split(":")[1];
    } else {
      id = step;
    }
    const target = document.getElementById(id);
    const [targetCenterX, targetCenterY] = this.calculateElementCenter(target);
    this.moveMouseTo(targetCenterX, targetCenterY);

    setTimeout(() => {
      this.click(target);

      if (value) {
        (target as HTMLInputElement).value = value;
        target.dispatchEvent(new Event("input"));
      }
    }, this.transitionTimeMs + this.waitBeforeClickMs);
    setTimeout(
      () => requestAnimationFrame(this.animate),
      this.transitionTimeMs + this.waitBeforeClickMs + this.animationIntervalMs
    );
    this.currentStep++;
  }

  calculateElementCenter(el: HTMLElement): [number, number] {
    switch (el.nodeName) {
      case "rect": {
        const container = document.getElementById("word-container");
        return [
          container.offsetLeft +
            Number(el.getAttribute("x")) +
            Number(el.getAttribute("width")) / 2,
          container.offsetTop +
            Number(el.getAttribute("y")) +
            Number(el.getAttribute("height")),
        ];
      }
      default: {
        const viewportOffset = el.getBoundingClientRect();
        return [
          viewportOffset.left + el.offsetWidth / 2,
          viewportOffset.top + el.offsetHeight / 2,
        ];
      }
    }
  }

  moveMouseTo(x: number, y: number) {
    this.mouse.style.transform = `translate(${x -
      Number(this.mouse.style.left.slice(0, -2))}px, ${y -
      Number(this.mouse.style.top.slice(0, -2))}px)`;
  }

  click(el: HTMLElement) {
    switch (el.nodeName) {
      case "rect": {
        el.dispatchEvent(new Event("click"));
        break;
      }
      default: {
        el.click();
        break;
      }
    }
  }
}
</script>

<style scoped>
.mouse {
  width: 40px;
  top: 0;
  left: 0;
  position: fixed;
}
</style>
