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
          <div class="canvas-container" v-if="currentDifficultyLevel === 1">
            <canvas
              v-for="(part, index) in originalNumbers"
              :key="index"
              :id="'encrypted-number-' + index"
              >{{ part }}</canvas
            >
          </div>
          <div class="canvas-container" v-else>
            <canvas
              v-for="(part, index) in originalLetters"
              :key="index"
              :id="'encrypted-letter-' + index"
              >{{ part }}</canvas
            >
          </div>
        </div>
        <div class="flex-flex equal-space">
          Lösung:
          <input
            class="card"
            v-model="decryptedNumbers"
            type="text"
            v-if="currentDifficultyLevel === 1"
          />
          <input class="card" v-model="decryptedLetters" type="text" v-else />
        </div>
      </div>
      <div class="flex-item flex-wrap" v-if="currentDifficultyLevel === 1">
        <div
          class="flex flex-center"
          :style="tableWidth"
          v-for="(shape, index) in numberTable"
          :key="index"
        >
          <canvas :id="'number-shape-' + index">Shape</canvas>
        </div>
      </div>
      <div class="flex-item flex-wrap" v-else>
        <div
          class="flex flex-center"
          :style="tableWidth"
          v-for="(shape, index) in letterTable"
          :key="index"
        >
          <canvas :id="'letter-shape-' + index">Shape</canvas>
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

  originalNumbers: string[] = null;
  decryptedNumbers: string = null;
  originalLetters: string[] = null;
  decryptedLetters: string = null;

  lookupNumber: Map<
    string,
    [Shape, Map<string, number | string | boolean>][]
  > = null;
  lookupLetter: Map<
    string,
    [Shape, Map<string, number | string | boolean>][]
  > = null;
  numberTable: [Shape, Map<string, number | string | boolean>][][] = null;
  letterTable: [Shape, Map<string, number | string | boolean>][][] = null;

  currentDifficultyLevel: number = null;
  difficultyLevels = 2;

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  isStarted(): boolean {
    return this.originalNumbers === null || this.originalLetters === null;
  }

  restartGame() {
    if (this.currentDifficultyLevel === null) {
      this.currentDifficultyLevel = 1;
    }
    this.originalNumbers = String(LoadRandomNumber()).split("");
    this.lookupNumber = NumberLookup;
    this.numberTable = NumberTable;

    this.originalLetters = LoadRandomElement(this.dataKey)
      .split("")
      .map((letter) => letter.toUpperCase());
    this.lookupLetter = LetterLookup;
    this.letterTable = LetterTable;
  }

  isCorrect(): boolean {
    if (this.currentDifficultyLevel === 1) {
      return this.originalNumbers.join("") === this.decryptedNumbers;
    } else {
      return this.originalLetters.join("") === this.decryptedLetters;
    }
  }

  drawShapes() {
    if (this.currentDifficultyLevel === 1) {
      this.originalNumbers.forEach((number, index) => {
        const cvText = new NumberCanvas(
          document.getElementById(
            `encrypted-number-${index}`
          ) as HTMLCanvasElement,
          100,
          100
        );
        cvText.draw(this.lookupNumber.get(number));
      });
      this.numberTable.forEach((shapes, index) => {
        const cvShape = new NumberCanvas(
          document.getElementById(`number-shape-${index}`) as HTMLCanvasElement,
          100,
          100
        );
        cvShape.draw(shapes);
      });
    } else {
      this.originalLetters.forEach((letter, index) => {
        const cvText = new LetterCanvas(
          document.getElementById(
            `encrypted-letter-${index}`
          ) as HTMLCanvasElement,
          50,
          50
        );
        cvText.draw(this.lookupLetter.get(letter));
      });
      this.letterTable.forEach((shapes, index) => {
        const cvShape = new LetterCanvas(
          document.getElementById(`letter-shape-${index}`) as HTMLCanvasElement,
          50,
          50
        );
        cvShape.draw(shapes);
      });
    }
  }

  changeDifficulty(level: number) {
    this.currentDifficultyLevel = level;
  }

  get tableWidth(): string {
    if (this.currentDifficultyLevel === 1) {
      return "flex: 0 0 15%;"; // 5 cols per row
    } else {
      return "flex: 0 0 7%;"; // 10 cols per row
    }
  }
}
</script>

<style scoped>
.flex {
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
.canvas-container > canvas {
  margin: 0.5em;
}
</style>
