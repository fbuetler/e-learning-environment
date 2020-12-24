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
          <div class="canvas-container card">
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
      <SymbolTable :table="table" :type="type" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Difficulty from "../Difficulty.vue";
import SymbolTable from "./SymbolTable.vue";
import {
  SymbolConfig,
  LoadRandomNumber,
  LoadRandomElement,
  NumberTable,
  NumberLookup,
  LetterTable,
  LetterLookup,
  GetNewCanvas,
  Type,
} from "./Ciphertext";

@Component<SymbolDecryption>({
  components: {
    Difficulty,
    SymbolTable,
  },
})
export default class SymbolDecryption extends Mixins(GameMixin)
  implements GameInterface {
  dataKey = "nouns";

  originalNumbers: string[] = null;
  originalLetters: string[] = null;
  decrypted: string = null;

  lookupNumber: Map<string, SymbolConfig> = null;
  lookupLetter: Map<string, SymbolConfig> = null;
  numberTable: SymbolConfig[][] = null;
  letterTable: SymbolConfig[][] = null;

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
    this.original.forEach((part, index) => {
      const cvText = GetNewCanvas(
        this.type,
        document.getElementById(`encrypted-${index}`) as HTMLCanvasElement,
        75,
        75
      );
      cvText.draw(this.lookup.get(part));
    });
  }

  changeDifficulty(level: number) {
    this.currentDifficultyLevel = level;
  }

  get original(): string[] {
    return this.currentDifficultyLevel === 1
      ? this.originalNumbers
      : this.originalLetters;
  }

  get table(): SymbolConfig[][] {
    return this.currentDifficultyLevel === 1
      ? this.numberTable
      : this.letterTable;
  }

  get lookup(): Map<string, SymbolConfig> {
    return this.currentDifficultyLevel === 1
      ? this.lookupNumber
      : this.lookupLetter;
  }

  get type(): Type {
    return this.currentDifficultyLevel === 1 ? Type.NUMBER : Type.LETTER;
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
</style>
