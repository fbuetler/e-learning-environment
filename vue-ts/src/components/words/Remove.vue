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
          v-if="element.char !== ''"
          @click="selectedChar = element.id"
          draggable
          @dragover.prevent
          @dragend.prevent
          @dragstart="selectedChar = element.id"
        >
          {{ element.char }}
        </div>
      </div>
    </div>
    <hr />
    <div class="interaction-container">
      <Trashcan @trashed-element="trashElement()" @click="trashElement()" />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";
import { LoadWords, wordElement } from "./Words";

@Component<Remove>({
  components: {
    Trashcan,
    Undo,
  },
})
export default class Remove extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "remove";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: number = null;
  private charRemoved = false;

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    [this.word, this.similarWords] = LoadWords(this.dataKey);
    this.selectedChar = null;
    this.charRemoved = false;
  }

  isCorrect(): boolean {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  trashElement() {
    if (this.charRemoved) {
      return;
    }
    this.word.forEach((el) => {
      if (el.id === this.selectedChar) {
        el.char = "";
      } else {
        el.locked = true;
      }
    });
    this.charRemoved = true;
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selectedChar = null;
    this.charRemoved = false;
  }
}
</script>
