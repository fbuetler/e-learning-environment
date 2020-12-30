<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficulty($event)"
    />
    <div class="flex-item flex-col">
      <div>Verschlüssle den Text mit Hilfe des Musters!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          <div>Text:</div>
          <div class="canvas-container card text">
            {{ decryptedText }}
          </div>
        </div>
        <div class="flex-item flex-row flex-center equal-space">
          <div>Lösung:</div>
          <input class="card text" v-model="encryptedText" type="text" />
        </div>
      </div>
      <div>
        <canvas class="card" id="pattern-canvas" width="500" height="150"
          >Das Muster ist nicht verfügbar</canvas
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Difficulty from "../Difficulty.vue";
import { CreatePattern, LoadRandomElement, PatternCanvas } from "./Ciphertext";

@Component<PatternEncryption>({
  components: {
    Difficulty,
  },
})
export default class PatternEncryption extends Mixins(GameMixin)
  implements GameInterface {
  dataKey = "nouns";

  originalText: string[] = null;
  encryptedText: string = null;

  patterns: Map<number, [number, number][]> = null;

  currentDifficultyLevel: number = null;
  difficultyLevels = 2;

  mounted() {
    this.draw();
  }

  updated() {
    this.draw();
  }

  isStarted(): boolean {
    return this.originalText === null;
  }

  restartGame() {
    if (this.currentDifficultyLevel === null) {
      this.currentDifficultyLevel = 1;
    }
    this.originalText = LoadRandomElement(this.dataKey)
      .split("")
      .map((letter) => letter.toUpperCase());
    this.encryptedText = null

    this.patterns = new Map<number, [number, number][]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      this.patterns.set(level, CreatePattern(this.originalText, level));
    }
  }

  isCorrect(): boolean {
    if (this.encryptedText === null) {
      return false;
    }
    const text = JSON.parse(JSON.stringify(this.originalText)) as string[];
    this.patterns.get(this.currentDifficultyLevel).forEach(([left, right]) => {
      const tmp = text[left];
      text[left] = text[right];
      text[right] = tmp;
    });
    return text.join("") === this.encryptedText.toUpperCase();
  }

  draw() {
    new PatternCanvas(
      document.getElementById(`pattern-canvas`) as HTMLCanvasElement
    ).draw(
      this.originalText.length,
      this.patterns.get(this.currentDifficultyLevel)
    );
  }

  changeDifficulty(level: number) {
    this.currentDifficultyLevel = level;
  }

  get decryptedText(): string {
    return this.originalText.join("");
  }
}
</script>

<style scoped>
.text {
  font-size: 2em;
}
</style>
