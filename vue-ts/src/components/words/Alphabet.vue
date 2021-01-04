<template>
  <div class="flex-item flex-wrap flex-center flex-row">
    <div
      :id="`alphabet-${char}`"
      class="word-char card"
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
  selectedChar: string;

  alphabet = [
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
