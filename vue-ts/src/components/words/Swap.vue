<template>
  <div>
    <div class="word-container">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char"
          :class="{
            locked: element.locked,
            selected: element.id === selectedChar,
          }"
          @click="swapChar(element.id)"
          draggable
          @dragstart="selectedChar = element.id"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="swapChar(element.id)"
        >
          {{ element.char }}
        </div>
      </div>
    </div>
    <hr />
    <div class="interaction-container">
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Undo from "@/components/Undo.vue";
import { LoadWords, wordElement } from "./LoadWords";

@Component<Change>({
  components: {
    Undo,
  },
})
export default class Change extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "change";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: number = null;
  private randomIndex: number = null;
  private charSwaped = false;

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    this.word = LoadWords(this.dataKey)[0];
    this.randomIndex = Math.floor(Math.random() * (this.word.length - 1));
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);

    this.selectedChar = null;
    this.charSwaped = false;
  }

  isCorrect(): boolean {
    return this.word.reduce(
      (acc, currVal) => acc && currVal.initialChar === currVal.char,
      true
    );
  }

  swapChar(id: number) {
    if (this.charSwaped) {
      return;
    }
    if (this.selectedChar === null) {
      this.selectedChar = id;
      return;
    }

    this.swap(
      this.word.find((el) => el.id === id),
      this.word.find((el) => el.id === this.selectedChar)
    );

    this.word.forEach((el) => (el.locked = true));
    this.charSwaped = true;
    this.selectedChar = null;
  }

  swap(a: wordElement, b: wordElement) {
    const temp = a.char;
    a.char = b.char;
    b.char = temp;
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);
    this.selectedChar = null;
    this.charSwaped = false;
  }
}
</script>

<style scoped></style>
