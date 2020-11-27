<template>
  <div>
    <div class="word-container">
      <div v-for="element in word" :key="element.id">
        <div
          class="char"
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
import words from "@/assets/words/words.json";

type wordElement = {
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
  private words: JSON = words;
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
    const keys = Object.keys(this.words[this.dataKey]);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const wordParts = key.split("");

    this.similarWords = this.words[this.dataKey][key];
    this.word = new Array<wordElement>();

    for (let i = 0; i < wordParts.length; i++) {
      this.word.push({
        id: i,
        char: wordParts[i],
        initialChar: wordParts[i],
        locked: false,
      });
    }
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

<style scoped>
.word-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em;
}
.char {
  background: white;
  border: 3px solid black;
  padding: 0.3em;
  margin: 0.2em;
}
.locked {
  background: lightgray;
}
.interaction-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
</style>
