<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficulty($event)"
    />
    <div class="flex-item flex-col">
      <div>Entschlüssle den Text mit Hilfe der Tabelle!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          Text:
          <div class="canvas-container">
            <canvas
              v-for="(part, index) in original"
              :key="index"
              :id="'encrypted-' + index"
              >{{ part }}</canvas
            >
          </div>
        </div>
        <div class="flex-flex equal-space">
          Lösung:
          <input class="card" v-model="decrypted" type="text" />
        </div>
      </div>
      <table>
        <tbody>
          <tr v-for="(row, rowIndex) in table" :key="rowIndex">
            <td v-for="(shape, shapeIndex) in row" :key="shapeIndex">
              <canvas :id="'shape-' + rowIndex + '-' + shapeIndex"
                >Shape</canvas
              >
            </td>
          </tr>
        </tbody>
      </table>
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
  originalLetters: string[] = null;
  decrypted: string = null;

  lookupNumber: Map<
    string,
    [Shape, Map<string, number | string | boolean>][]
  > = null;
  lookupLetter: Map<
    string,
    [Shape, Map<string, number | string | boolean>][]
  > = null;
  numberTable: [Shape, Map<string, number | string | boolean>][][][] = null;
  letterTable: [Shape, Map<string, number | string | boolean>][][][] = null;

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
      return this.originalNumbers.join("") === this.decrypted;
    } else {
      return this.originalLetters.join("") === this.decrypted.toUpperCase();
    }
  }

  drawShapes() {
    if (this.currentDifficultyLevel === 1) {
      this.originalNumbers.forEach((number, index) => {
        const cvText = new NumberCanvas(
          document.getElementById(`encrypted-${index}`) as HTMLCanvasElement,
          100,
          100
        );
        cvText.draw(this.lookupNumber.get(number));
      });
      this.numberTable.forEach((row, rowIndex) => {
        row.forEach((shapes, shapeIndex) => {
          const cvShape = new NumberCanvas(
            document.getElementById(
              `shape-${rowIndex}-${shapeIndex}`
            ) as HTMLCanvasElement,
            100,
            100
          );
          cvShape.draw(shapes);
        });
      });
    } else {
      this.originalLetters.forEach((letter, index) => {
        const cvText = new LetterCanvas(
          document.getElementById(`encrypted-${index}`) as HTMLCanvasElement,
          50,
          50
        );
        cvText.draw(this.lookupLetter.get(letter));
      });
      this.letterTable.forEach((row, rowIndex) => {
        row.forEach((shapes, shapeIndex) => {
          const cvShape = new LetterCanvas(
            document.getElementById(
              `shape-${rowIndex}-${shapeIndex}`
            ) as HTMLCanvasElement,
            50,
            50
          );
          cvShape.draw(shapes);
        });
      });
    }
  }

  changeDifficulty(level: number) {
    this.currentDifficultyLevel = level;
  }

  get original(): string[] {
    return this.currentDifficultyLevel === 1
      ? this.originalNumbers
      : this.originalLetters;
  }

  get table(): [Shape, Map<string, number | string | boolean>][][][] {
    return this.currentDifficultyLevel === 1
      ? this.numberTable
      : this.letterTable;
  }
}
</script>

<style scoped>
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
table {
  width: 100%;
  border-spacing: 0;
}
td {
  border-right: 4px solid black;
  border-bottom: 4px solid black;
}
</style>
