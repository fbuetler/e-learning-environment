<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben entfernst.
    </div>
    <div
      id="word-container"
      class="word-container flex-item flex-row flex-center"
    >
      <div v-for="element in word" :key="element.id">
        <div
          v-if="element.char !== ''"
          :id="`word-char-${element.id}`"
          :class="{
            locked: element.locked,
            selected: element.id === selected,
          }"
          class="word-char card clickable"
          @click="selected = element.id"
          draggable
          @dragover.prevent
          @dragend.prevent
          @dragstart="selected = element.id"
        >
          {{ element.char }}
        </div>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <Trashcan @trashed-element="trashElement()" />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";
import {
  LoadWords,
  wordElement,
  findCorrectAndWrongSolutions,
} from "@/components/words/Words";

@Component<Remove>({
  components: {
    Trashcan,
    Undo,
  },
})
export default class Remove extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  similarWords: string[] = null;
  selected: number = null;
  charRemoved = false;
  animationSteps: Array<string> = null;

  isStarted(): boolean {
    return this.word === null;
  }

  start() {
    [this.word, this.similarWords] = LoadWords("remove", 1);
    this.selected = null;
    this.charRemoved = false;
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  trashElement() {
    if (this.charRemoved) {
      return;
    }
    this.word.forEach((el) => {
      if (el.id === this.selected) {
        el.char = "";
      }
      el.locked = true;
    });
    this.charRemoved = true;
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selected = null;
    this.charRemoved = false;
  }

  getAnimationSteps(): Array<string> {
    const [correctPos, , wrongPos, ,] = findCorrectAndWrongSolutions(
      this.word.map((el) => el.char).join(""),
      this.similarWords[0]
    );
    return new Array<string>(
      `word-char-${wrongPos}`,
      "trashcan",
      "button-menu-check",
      "undo",
      `word-char-${correctPos}`,
      "trashcan",
      "button-menu-check",
      "button-menu-next"
    );
  }
}
</script>
