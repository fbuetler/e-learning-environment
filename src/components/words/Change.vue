<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben änderst.
    </div>
    <div
      id="word-container"
      class="word-container flex-item flex-row flex-center"
    >
      <div v-for="element in word" :key="element.id">
        <div
          :id="`word-char-${element.id}`"
          :class="{ locked: element.locked }"
          class="word-char card"
          @click="changeChar(element.id)"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="changeChar(element.id)"
        >
          {{ element.char }}
        </div>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="selected"
        :items="items"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import ItemSelection, { item } from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import {
  LoadWords,
  wordElement,
  alphabet,
  items,
  findCorrectAndWrongSolutions,
} from "@/components/words/Words";

@Component<Change>({
  components: {
    ItemSelection,
    Undo,
  },
})
export default class Change extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  similarWords: string[] = null;
  selected: string = null;
  animationSteps: Array<string> = null;

  isStarted(): boolean {
    return this.word === null;
  }

  start() {
    [this.word, this.similarWords] = LoadWords("change", 1);
    this.selected = null;
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  changeChar(id: number) {
    if (this.selected === null) {
      return;
    }
    const element = this.word.find((el) => el.id === id);
    if (element.locked) {
      return;
    }
    if (alphabet[this.selected] === element.initialChar) {
      element.char = element.initialChar;
      this.word.map((el) => (el.locked = false));
      return;
    }
    this.word.filter((el) => el.id !== id).forEach((el) => (el.locked = true));
    element.char = alphabet[this.selected];
    this.selected = null;
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selected = null;
  }

  getAnimationSteps(): Array<string> {
    const [
      correctPos,
      correctChar,
      wrongPos,
      wrongChar,
    ] = findCorrectAndWrongSolutions(
      this.word.map((el) => el.char).join(""),
      this.similarWords[0]
    );
    return new Array<string>(
      `item-selection-${alphabet.findIndex((el) => el === wrongChar)}`,
      `word-char-${wrongPos}`,
      "button-menu-check",
      "undo",
      `item-selection-${alphabet.findIndex((el) => el === correctChar)}`,
      `word-char-${correctPos}`,
      "button-menu-check",
      "button-menu-next"
    );
  }

  get items(): item[] {
    return items;
  }
}
</script>
