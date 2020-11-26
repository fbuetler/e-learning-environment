<template>
  <div class="alphabet-container">
    <div
      class="alphabet-item"
      :class="{ selected: char === selectedChar }"
      v-for="char in alphabet"
      :key="char"
      @click="$emit('char-selected', char)"
      draggable
      @dragstart="$emit('char-selected', char)"
      @dragover.prevent
      @dragend.prevent
    >
      {{ char }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<Alphabet>({})
export default class Alphabet extends Vue {
  @Prop()
  private selectedChar: string;

  private alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
}
</script>

<style scoped>
.alphabet-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.alphabet-item {
  background: white;
  border: 3px solid black;
  padding: 0.3em;
  margin: 0.2em;
}
.alphabet-item.selected {
  background: #eeee4e;
}
</style>
