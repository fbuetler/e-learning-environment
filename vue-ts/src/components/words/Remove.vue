<template>
  <div>
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben entfernst.
    </div>
    <div class="word-container flex-item flex-row flex-center">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char card clickable"
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
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <Trashcan @trashed-element="trashElement()" @click="trashElement()" />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";
import { LoadWords, wordElement } from "@/components/words/Words";

@Component<Remove>({
  components: {
    Trashcan,
    Undo,
  },
})
export default class Remove extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  similarWords: string[] = null;
  selectedChar: number = null;
  charRemoved = false;

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    [this.word, this.similarWords] = LoadWords("remove", 1);
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
