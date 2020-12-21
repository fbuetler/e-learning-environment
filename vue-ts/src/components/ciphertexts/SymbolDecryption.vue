<template>
  <div class="flex-item flex-col">
    <div>Entschlüssle den Text mit Hilfe der Tabelle</div>
    <div class="flex-item flex-row flex-center">
      <div class="flex-item flex-row flex-center equal-space">
        Text:
        <div class="canvas-container">
          <canvas
            v-for="(number, index) in text"
            :key="index"
            :id="'encrypted-text-' + index"
            >Text</canvas
          >
        </div>
      </div>
      <div class="flex-flex equal-space">
        Lösung:
        <input class="card" v-model.number="decryptedText" type="text" />
      </div>
    </div>
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
import { Canvas, Shape, LoadRandomNumber } from "./Ciphertext";

@Component<SymbolDecryption>({})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  number: number = null;
  dataKey = "nouns";

  decryptedText: number = null;

  lookupTable: Map<number, [Shape, number][]> = new Map([
    [
      0,
      [
        [Shape.RECTANGLE, 1],
        [Shape.DOT, 1],
      ],
    ],
    [
      1,
      [
        [Shape.RECTANGLE, 1],
        [Shape.DOT, 2],
      ],
    ],
    [
      2,
      [
        [Shape.RECTANGLE, 1],
        [Shape.DOT, 3],
      ],
    ],
    [
      3,
      [
        [Shape.RECTANGLE, 1],
        [Shape.DOT, 4],
      ],
    ],
    [
      4,
      [
        [Shape.CIRCLE, 1],
        [Shape.DOT, 1],
      ],
    ],
    [
      5,
      [
        [Shape.CIRCLE, 1],
        [Shape.DOT, 2],
      ],
    ],
    [
      6,
      [
        [Shape.CIRCLE, 1],
        [Shape.DOT, 3],
      ],
    ],
    [
      7,
      [
        [Shape.CIRCLE, 1],
        [Shape.DOT, 4],
      ],
    ],
    [
      8,
      [
        [Shape.TRIANGLE, 1],
        [Shape.DOT, 1],
      ],
    ],
    [
      9,
      [
        [Shape.TRIANGLE, 1],
        [Shape.DOT, 2],
      ],
    ],
  ]);

  mounted() {
    this.text.forEach((number, index) => {
      const cvText = new Canvas(
        document.getElementById(`encrypted-text-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvText.draw(this.lookupTable.get(number));
    });
    this.shapes.forEach((shapes, index) => {
      const cvShape = new Canvas(
        document.getElementById(`shape-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvShape.draw(shapes);
    });
  }

  isStarted(): boolean {
    return this.number === null;
  }

  restartGame() {
    this.number = 27;
  }

  isCorrect(): boolean {
    return this.number === this.decryptedText;
  }

  get text(): number[] {
    return this.number
      .toString()
      .split("")
      .map((el) => +el);
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
.flex-item {
  padding: 1em;
}
.equal-space {
  flex: 1 1 0px;
}
.canvas-container {
  margin: 1em;
}
</style>
