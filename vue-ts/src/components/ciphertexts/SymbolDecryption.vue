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
import {
  Canvas,
  NumberShape,
  LetterShape,
  LoadRandomNumber,
  NumberShapeTable,
  NumberShapeLookupTable,
  LetterShapeTable,
} from "./Ciphertext";

@Component<SymbolDecryption>({})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  number: number = null;
  dataKey = "nouns";

  decryptedText: number = null;

  numberLookupTable = NumberShapeLookupTable;

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.number === null;
  }

  restartGame() {
    this.number = LoadRandomNumber();
  }

  isCorrect(): boolean {
    return this.number === this.decryptedText;
  }

  drawShapes() {
    this.text.forEach((number, index) => {
      const cvText = new Canvas(
        document.getElementById(`encrypted-text-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvText.drawNumberShape(this.numberLookupTable.get(number));
    });
    this.shapes.forEach((shapes, index) => {
      const cvShape = new Canvas(
        document.getElementById(`shape-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvShape.drawNumberShape(shapes);
    });
  }

  get text(): number[] {
    return this.number
      .toString()
      .split("")
      .map((el) => +el);
  }

  get shapes():
    | [NumberShape, number][][]
    | [LetterShape, Map<string, number>][][] {
    return NumberShapeTable;
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
