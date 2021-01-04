<template>
  <div>
    <svg
      viewBox="11.8 9 16 22"
      id="mouse"
      class="mouse"
      :style="`transition: transform ${transitionTimeMs / 1000}s;`"
    >
      <path d="M20,21l4.5,8l-3.4,2l-4.6-8.1L12,29V9l16,12H20z"></path>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<TutorialAnimation>({})
export default class TutorialAnimation extends Vue {
  @Prop({ required: true })
  targets: Array<string>;

  mouse: HTMLElement = null;
  currentTarget = 0;
  transitionTimeMs = 1000;
  animationIntervalMs = 1500;
  waitBeforeClickMs = 500;

  mounted() {
    this.mouse = document.getElementById("mouse") as HTMLElement;
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
    if (this.currentTarget >= this.targets.length) {
      this.$emit("finished");
      return;
    }
    const target = document.getElementById(this.targets[this.currentTarget]);
    const [targetCenterX, targetCenterY] = this.calculateElementCenter(target);
    this.moveMouseTo(targetCenterX, targetCenterY);

    setTimeout(
      () => this.click(target),
      this.transitionTimeMs + this.waitBeforeClickMs
    );
    setTimeout(
      () => requestAnimationFrame(this.animate),
      this.transitionTimeMs + this.waitBeforeClickMs + this.animationIntervalMs
    );
    this.currentTarget++;
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
        return [
          el.offsetLeft + el.offsetWidth / 2,
          el.offsetTop + el.offsetHeight / 2,
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
svg {
  width: 40px;
  top: 0;
  left: 0;
  position: fixed;
}
</style>
