<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="currentDifficultyLevel = $event"
    />
    <div class="flex-item flex-col">
      <div>Entschlüssle den Text mit Hilfe des Musters!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          <div>Text:</div>
          <div class="canvas-container card big-text">
            {{ encryptedText }}
          </div>
        </div>
        <div class="flex-item flex-row flex-center equal-space">
          <div>Lösung:</div>
          <input
            class="card big-text"
            size="5"
            v-model="decryptedText"
            type="text"
          />
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
    this.originalText = LoadRandomElement(this.dataKey)
      .split("")
      .map((letter) => letter.toUpperCase());
    this.decryptedText = null;

    this.patterns = new Map<number, [number, number][]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      this.patterns.set(level, CreatePattern(this.originalText, level));
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
