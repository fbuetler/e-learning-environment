<template>
  <div class="difficulty flex-item flex-center flex-row">
    <div
      :id="`difficulty-${level}`"
      class="card"
      :class="{
        selected: level === selected,
        locked: level > difficultyLevels,
      }"
      :title="
        `Schwierigkeitsgrad: ${getDifficultyDescription(
          level
        )} ${getLockedDescription(level > difficultyLevels)}`
      "
      v-for="level in displayDifficultyLevels"
      :key="level"
      @click="selectDifficulty(level)"
    >
      <img :src="require(`@/assets/difficulty/difficulty_${level}.png`)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<Difficulty>({})
export default class Difficulty extends Vue {
  @Prop({ required: true })
  difficultyLevels: number;
  @Prop({ required: true })
  selected: number;

  maxDifficultyLevels = 3;

  selectDifficulty(level: number) {
    if (level > this.difficultyLevels) {
      return;
    }
    this.$emit("difficulty-selected", level);
  }

  getDifficultyDescription(difficulty: number): string {
    switch (difficulty) {
      case 1: {
        return "leicht";
      }
      case 2: {
        return "mittelschwer";
      }
      case 3: {
        return "schwer";
      }
      default: {
        return "keine Angabe";
      }
    }
  }
  getLockedDescription(locked: boolean): string {
    return locked ? "(nicht vorhanden)" : "";
  }

  get displayDifficultyLevels(): number {
    return Math.min(this.difficultyLevels, this.maxDifficultyLevels);
  }
}
</script>

<style scoped>
.difficulty > div > img {
  max-width: 100%;
}
</style>
