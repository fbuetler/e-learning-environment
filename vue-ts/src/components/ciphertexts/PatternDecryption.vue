<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficulty($event)"
    />
    <div class="flex-item flex-col">
      <div>Entschlüssle den Text mit Hilfe des Musters!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          Text:
          <div class="canvas-container card">
            {{ encryptedText }}
          </div>
        </div>
        <div class="flex-flex equal-space">
          Lösung:
          <input class="card" v-model="decryptedText" type="text" />
        </div>
      </div>
      <div>
        <canvas id="pattern-canvas" width="500" height="150">test</canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Difficulty from "../Difficulty.vue";
import { LoadRandomElement, PatternCanvas } from "./Ciphertext";

@Component<PatternDecryption>({
  components: {
    Difficulty,
  },
})
export default class PatternDecryption extends Mixins(GameMixin)
  implements GameInterface {
  dataKey = "nouns";

  originalText: string[] = null;
  decryptedText: string = null;

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

    this.patterns = new Map<number, [number, number][]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      const pattern = new Array<[number, number]>();
      const available = [...Array(this.originalText.length).keys()];
      for (let j = 1; j <= level && 2 * j <= this.originalText.length; j++) {
        const leftIndex = Math.floor(Math.random() * available.length);
        const left = available[leftIndex];
        available.splice(leftIndex, 1);
        const rightIndex = Math.floor(Math.random() * available.length);
        const right = available[rightIndex];
        available.splice(rightIndex, 1);
        pattern.push([left, right]);
      }
      this.patterns.set(level, pattern);
    }
  }

  isCorrect(): boolean {
    if (this.decryptedText === null) {
      return false;
    }
    return this.originalText.join("") === this.decryptedText.toUpperCase();
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

  get encryptedText(): string {
    const text = JSON.parse(JSON.stringify(this.originalText)) as string[];
    this.patterns.get(this.currentDifficultyLevel).forEach(([left, right]) => {
      const tmp = text[left];
      text[left] = text[right];
      text[right] = tmp;
    });
    return text.join("");
  }
}
</script>

<style scoped></style>
