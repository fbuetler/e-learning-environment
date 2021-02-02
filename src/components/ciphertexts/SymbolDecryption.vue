<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="
        currentDifficultyLevel = $event;
        start();
      "
    />
    <div class="flex-item flex-col">
      <div>Entschlüssle den Text mit Hilfe der Tabelle!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          Text:
          <div id="text" class="canvas-container card">
            <canvas
              v-for="(part, index) in original"
              :id="'encrypted-' + index"
              :key="index"
              width="50"
              height="50"
              >{{ part }}</canvas
            >
          </div>
        </div>
        <div class="flex-flex equal-space">
          Lösung:
          <input
            id="answer-input"
            v-model="decrypted"
            class="card big-text"
            size="5"
            type="text"
          />
        </div>
      </div>
      <SymbolTable :table="table" :type="type" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Difficulty from "@/components/Difficulty.vue";
import SymbolTable from "@/components/ciphertexts/SymbolTable.vue";
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
} from "@/components/ciphertexts/Ciphertext";

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
  animationSteps: Array<string> = null;

  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  mounted() {
    this.drawShapes();
  }

  updated() {
    this.drawShapes();
  }

  isInitialized(): boolean {
    return this.originalNumbers !== null && this.originalLetters !== null;
  }

  start() {
    this.originalNumbers = String(LoadRandomNumber()).split("");
    this.decrypted = null;

    this.originalLetters = LoadRandomElement(this.dataKey)
      .split("")
      .map((letter) => letter.toUpperCase());
    this.animationSteps = this.getAnimationSteps();
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
        document.getElementById(`encrypted-${index}`) as HTMLCanvasElement
      );
      cvText.draw(this.lookup.get(part));
    });
  }

  getAnimationSteps(): Array<string> {
    let wrongAnswer: string;
    if (this.currentDifficultyLevel === 1) {
      wrongAnswer = String(LoadRandomNumber());
    } else {
      wrongAnswer = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, this.originalLetters.length)
        .toUpperCase();
    }
    return [
      `answer-input:${wrongAnswer}`,
      "button-menu-check",
      `answer-input:${
        this.currentDifficultyLevel === 1
          ? this.originalNumbers.join("")
          : this.originalLetters.join("")
      }`,
      "button-menu-check",
      "button-menu-next",
    ];
  }

  get original(): string[] {
    return this.currentDifficultyLevel === 1
      ? this.originalNumbers
      : this.originalLetters;
  }

  get table(): SymbolConfig[][] {
    return this.currentDifficultyLevel === 1 ? NumberTable : LetterTable;
  }

  get lookup(): Map<string, SymbolConfig> {
    return this.currentDifficultyLevel === 1 ? NumberLookup : LetterLookup;
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
.canvas-container {
  margin: 1em;
}
.canvas-container > canvas {
  margin: 0.5em;
}
</style>
