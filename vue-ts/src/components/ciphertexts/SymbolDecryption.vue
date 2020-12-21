<template>
  <div>
    <div>{{ noun }}</div>
    <div class="flex-item flex-wrap">
      <div
        class="flex flex-center"
        v-for="(shape, index) in shapes"
        :key="index"
      >
        <canvas :id="'shape-' + index">Shape</canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import { Canvas, Shape } from "./Ciphertext";
import { LoadRandomElement } from "./Ciphertext";

@Component<SymbolDecryption>({})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  noun: string = null;
  dataKey = "nouns";

  mounted() {
    this.shapes.forEach((shapes, index) => {
      const cv = new Canvas(
        document.getElementById(`shape-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cv.draw(shapes);
    });
  }

  isStarted(): boolean {
    return this.noun === null;
  }

  restartGame() {
    this.noun = LoadRandomElement(this.dataKey);
  }

  isCorrect(): boolean {
    return false;
  }

  get shapes(): [Shape, number][][] {
    return [
      [[Shape.EMPTY, 0]],
      [[Shape.DOT, 1]],
      [[Shape.DOT, 2]],
      [[Shape.DOT, 3]],
      [[Shape.DOT, 4]],
      [[Shape.RECTANGLE, 1]],
      [[Shape.TEXT, 0]],
      [[Shape.TEXT, 1]],
      [[Shape.TEXT, 2]],
      [[Shape.TEXT, 3]],
      [[Shape.CIRCLE, 1]],
      [[Shape.TEXT, 4]],
      [[Shape.TEXT, 5]],
      [[Shape.TEXT, 6]],
      [[Shape.TEXT, 7]],
      [[Shape.TRIANGLE, 1]],
      [[Shape.TEXT, 8]],
      [[Shape.TEXT, 9]],
      [[Shape.EMPTY, 0]],
      [[Shape.EMPTY, 0]],
    ];
  }
}
</script>

<style scoped>
.flex {
  flex: 0 0 15%; /* ensures having 5 cols per row */
  padding: 1em;
  border-right: 4px solid black;
  border-bottom: 4px solid black;
  color: orange;
}
</style>
