<template>
  <div>
    <div class="word-container">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char"
          :class="{ 'word-char-locked': element.locked }"
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
    <div class="interaction-container">
      <Alphabet
        :selectedChar="selectedChar"
        @char-selected="selectedChar = $event"
      />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Alphabet from "@/components/words/Alphabet.vue";
import Undo from "@/components/Undo.vue";
import { EventBus, EventBusEvents } from "../EventBus";
import { LoadWords } from "./LoadWords";

export type wordElement = {
  id: number;
  char: string;
  initialChar: string;
  locked: boolean;
};

@Component<Change>({
  components: {
    Alphabet,
    Undo,
  },
})
export default class Change extends Vue {
  @Prop({ required: true })
  private args!: {};

  private dataKey = "change";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: string = null;

  created() {
    if (this.word === null) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  private restartGame() {
    [this.word, this.similarWords] = LoadWords(this.dataKey);
  }

  private evaluateGame() {
    const isCorrect = this.similarWords.includes(
      this.word.map((el) => el.char).join("")
    );
    this.$emit("evaluated-game", isCorrect);
  }

  private changeChar(id: number) {
    const element = this.word.find((el) => el.id === id);
    if (element.locked) {
      return;
    }
    if (this.selectedChar === element.initialChar) {
      element.char = element.initialChar;
      this.word.map((el) => (el.locked = false));
      return;
    }
    this.word.filter((el) => el.id !== id).forEach((el) => (el.locked = true));
    element.char = this.selectedChar;
  }

  private undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selectedChar = null;
  }
}
</script>
