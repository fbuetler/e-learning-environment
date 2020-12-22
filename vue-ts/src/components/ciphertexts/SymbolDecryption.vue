<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficulty($event)"
    />
    <div class="flex-item flex-col">
      <div>Entschlüssle den Text mit Hilfe der Tabelle</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          Text:
          <div class="canvas-container">
            <canvas
              v-for="(part, index) in text"
              :key="index"
              :id="'encrypted-text-' + index"
              >Text</canvas
            >
          </div>
        </div>
        <div class="flex-flex equal-space">
          Lösung:
          <input class="card" v-model="decryptedText" type="text" />
        </div>
      </div>
      <div class="flex-item flex-wrap">
        <div
          class="flex flex-center"
          v-for="(shape, index) in table"
          :key="index"
        >
          <canvas :id="'shape-' + index">Shape</canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Difficulty from "../Difficulty.vue";
import {
  NumberCanvas,
  LetterCanvas,
  Shape,
  LoadRandomNumber,
  LoadRandomElement,
  NumberTable,
  NumberLookup,
  LetterTable,
  LetterLookup,
} from "./Ciphertext";

@Component<SymbolDecryption>({
  components: {
    Difficulty,
  },
})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  dataKey = "nouns";

  originalText: string = null;
  decryptedText: string = null;

  lookupTable: Map<string, [Shape, Map<string, number>][]> = null;
  table: [Shape, Map<string, number>][][] = null;

  currentDifficultyLevel: number = null;
  difficultyLevels = 2;

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.originalText === null;
  }

  restartGame() {
    if (this.currentDifficultyLevel === null) {
      this.currentDifficultyLevel = 1;
    }
    if (this.currentDifficultyLevel === 1) {
      this.originalText = String(LoadRandomNumber());
      this.lookupTable = NumberLookup;
      this.table = NumberTable;
    } else {
      this.originalText = LoadRandomElement(this.dataKey);
      this.lookupTable = LetterLookup;
      this.table = LetterTable;
    }
  }

  isCorrect(): boolean {
    return this.originalText == this.decryptedText;
  }

  drawShapes() {
    this.text.forEach((number, index) => {
      const cvText = new NumberCanvas(
        document.getElementById(`encrypted-text-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvText.draw(this.lookupTable.get(number));
    });
    this.table.forEach((shapes, index) => {
      const cvShape = new NumberCanvas(
        document.getElementById(`shape-${index}`) as HTMLCanvasElement,
        100,
        100
      );
      cvShape.draw(shapes);
    });
  }

  changeDifficulty(level: number) {
    this.currentDifficultyLevel = level;
  }

  get text(): string[] {
    return this.originalText.toString().split("");
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
