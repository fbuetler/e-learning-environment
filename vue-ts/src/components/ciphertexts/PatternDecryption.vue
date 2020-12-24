<template>
  <div>
    <canvas id="test-canvas" width="500" height="150">test</canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PatternCanvas } from "./Ciphertext";

@Component<PatternDecryption>({})
export default class PatternDecryption extends Vue {
  mounted() {
    this.draw();
  }

  updated() {
    this.draw();
  }

  draw() {
    const patternCanvas = new PatternCanvas(
      document.getElementById(`test-canvas`) as HTMLCanvasElement
    );

    patternCanvas.draw(15, [
      [0, 14],
      [1, 7],
      [3, 5],
      [2, 6],
      [4, 13],
      [8, 12],
      [9, 11],
    ]);
  }
}
</script>

<style scoped></style>
