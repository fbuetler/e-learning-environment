<template>
  <div>
    <div class="word-container">
      <div class="word-item" v-for="element in word" :key="element.id">
        <div class="placeholder" @click="insertChar(element.id)">?</div>
        <div class="word">{{ element.letter }}</div>
      </div>
      <div class="placeholder" @click="insertChar(word.length)">?</div>
    </div>
    <Alphabet
      :selectedChar="selectedChar"
      @char-selected="(char) => charSelected(char)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Alphabet from "@/components/words/Alphabet.vue";
import { EventBus, EventBusEvents } from "../EventBus";
import words from "@/assets/words/words.json";

@Component<Add>({
  components: {
    Alphabet,
  },
})
export default class Add extends Vue {
  @Prop({ required: true })
  private args!: {};

  private dataKey = "insert";

  private words: JSON = words;
  private word: { id: number; letter: string }[] = null;
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
    this.word = new Array<{ id: number; letter: string }>();

    for (let i = 0; i < wordParts.length; i++) {
      this.word.push({
        id: i,
        letter: wordParts[i],
      });
    }
  }

  private evaluateGame() {
    const isCorrect = this.similarWords.includes(
      this.word.map((el) => el.letter).join("")
    );
    this.$emit("evaluated-game", isCorrect);
  }

  private charSelected(char: string) {
    this.selectedChar = char;
  }

  private insertChar(addBefore: number) {
    this.word.splice(addBefore, 0, {
      id: Math.max(...this.word.map((el) => el.id)) + 1,
      letter: this.selectedChar,
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
.word-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.placeholder {
  background: white;
  min-width: 1em;
}
.word {
  background: white;
  border: 3px solid black;
  padding: 0.3em;
  margin: 0.2em;
}
</style>
