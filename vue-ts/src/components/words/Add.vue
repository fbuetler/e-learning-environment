<template>
  <div>
    <div class="word-container">
      <div class="word-item" v-for="element in word" :key="element.id">
        <div
          class="placeholder"
          @click="addChar(element.id)"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="addChar(element.id)"
        >
          ?
        </div>
        <div
          class="word-char"
          :class="{
            locked: element.locked,
            selected: element.id === selectedChar,
          }"
          @click="selectedChar = element.id"
          draggable
          @dragover.prevent
          @dragend.prevent
          @dragstart="dragChar($event, element.id)"
        >
          {{ element.char }}
        </div>
      </div>
      <div
        class="placeholder"
        @click="addChar(word.length)"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="addChar(word.length)"
      >
        ?
      </div>
    </div>
    <hr />
    <div class="interaction-container">
      <Alphabet
        :selectedChar="selectedChar"
        @char-selected="selectedChar = $event"
      />
      <Trashcan @trashed-element="trashElement($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Alphabet from "@/components/words/Alphabet.vue";
import Trashcan from "@/components/Trashcan.vue";
import { LoadWords, wordElement } from "./Words";

@Component<Add>({
  components: {
    Alphabet,
    Trashcan,
  },
})
export default class Add extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "add";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: string = null;
  private charAdded = false;

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    [this.word, this.similarWords] = LoadWords(this.dataKey);
    this.word.forEach((el) => (el.locked = true));
  }

  isCorrect() {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  addChar(addBefore: number) {
    if (this.selectedChar === null || this.charAdded) {
      return;
    }
    this.word.splice(addBefore, 0, {
      id: Math.max(...this.word.map((el) => el.id)) + 1,
      char: this.selectedChar,
      initialChar: "",
      locked: false,
    });
    this.selectedChar = null;
    this.charAdded = true;
  }

  dragChar(event: DragEvent, id: string) {
    event.dataTransfer.setData("id", id);
  }

  trashElement(event: Event) {
    let id: number;
    if (event instanceof DragEvent) {
      id = +event.dataTransfer.getData("id");
    } else if (!isNaN(+this.selectedChar)) {
      id = +this.selectedChar;
    } else {
      return;
    }
    if (this.word.find((el) => el.id === id).locked) {
      return;
    }
    this.word = this.word.filter((el) => el.id !== id);
    this.charAdded = false;
  }
}
</script>

<style scoped>
.word-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.placeholder {
  min-width: 1em;
  border: 1px dashed black;
}
</style>
