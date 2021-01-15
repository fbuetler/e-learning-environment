<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
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
            id="answer-input"
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
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Difficulty from "@/components/Difficulty.vue";
import {
  CreatePattern,
  LoadRandomElement,
  PatternCanvas,
} from "@/components/ciphertexts/Ciphertext";

/*
  TODO
    - generate wrong input in tutorial animation
*/

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

  patternPerLevel: Map<number, [number, number][]> = null;
  animationSteps: Array<string> = null;

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
    this.decryptedText = null;

    this.patternPerLevel = new Map<number, [number, number][]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      this.patternPerLevel.set(level, CreatePattern(this.originalText, level));
    }
    this.animationSteps = this.getAnimationSteps();
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
      this.patternPerLevel.get(this.currentDifficultyLevel)
    );
  }

  getAnimationSteps(): Array<string> {
    return [
      `answer-input:${-1}`,
      "button-menu-check",
      `answer-input:${this.originalText.join("")}`,
      "button-menu-check",
      "button-menu-next",
    ];
  }

  get encryptedText(): string {
    const text = this.originalText.slice();
    this.patternPerLevel
      .get(this.currentDifficultyLevel)
      .forEach(([left, right]) => {
        const tmp = text[left];
        text[left] = text[right];
        text[right] = tmp;
      });
    return text.join("");
  }
}
</script>

<style scoped></style>
