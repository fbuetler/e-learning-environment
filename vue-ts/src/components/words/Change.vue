<template>
  <div @dragend.prevent="selected = null">
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben änderst.
    </div>
    <div class="word-container flex-item flex-row flex-center">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char card"
          :class="{ locked: element.locked }"
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

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    [this.word, this.similarWords] = LoadWords("change", 1);
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
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selected = null;
  }

  get items(): item[] {
    return items;
  }
}
</script>
