<template>
  <div class="difficulty flex-item flex-center flex-row">
    <div
      class="card"
      :class="{
        selected: level === selected,
        locked: level > difficultyLevels,
      }"
      v-for="level in 3"
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

  selectDifficulty(level: number) {
    if (level > this.difficultyLevels) {
      return;
    }
    this.$emit("difficulty-selected", level);
  }
}
</script>

<style scoped>
.difficulty > div > img {
  max-width: 100%;
}
</style>
