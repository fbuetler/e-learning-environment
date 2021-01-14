<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="currentDifficultyLevel = $event"
    />
    <div class="flex-item flex-col">
      <div>Verschlüssle den Text mit Hilfe des Musters!</div>
      <div class="flex-item flex-row flex-center">
        <div class="flex-item flex-row flex-center equal-space">
          <div>Text:</div>
          <div class="canvas-container card big-text">
            {{ decryptedText }}
          </div>
        </div>
        <div class="flex-item flex-row flex-center equal-space">
          <div>Lösung:</div>
          <input
            class="card big-text"
            size="5"
            v-model="encryptedText"
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
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Difficulty from "@/components/Difficulty.vue";
import {
  CreatePattern,
  LoadRandomElement,
  PatternCanvas,
} from "@/components/ciphertexts/Ciphertext";

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

  patternPerLevel: Map<number, [number, number][]> = null;

  currentDifficultyLevel = 1;
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
    this.encryptedText = null;

    this.patternPerLevel = new Map<number, [number, number][]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      this.patternPerLevel.set(level, CreatePattern(this.originalText, level));
    }
  }

  isCorrect(): boolean {
    if (this.encryptedText === null) {
      return false;
    }
    const text = JSON.parse(JSON.stringify(this.originalText)) as string[];
    this.patternPerLevel
      .get(this.currentDifficultyLevel)
      .forEach(([left, right]) => {
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
      this.patternPerLevel.get(this.currentDifficultyLevel)
    );
  }

  get decryptedText(): string {
    return this.originalText.join("");
  }
}
</script>

<style scoped></style>
