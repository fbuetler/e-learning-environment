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
          class="char"
          :class="{ locked: element.locked }"
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
      <Trashcan @trashed-element="(event) => trashElement(event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Alphabet from "@/components/words/Alphabet.vue";
import Trashcan from "@/components/Trashcan.vue";
import { EventBus, EventBusEvents } from "../EventBus";
import words from "@/assets/words/words.json";

@Component<Add>({
  components: {
    Alphabet,
    Trashcan,
  },
})
export default class Add extends Vue {
  @Prop({ required: true })
  private args!: {};

  private dataKey = "add";

  private words: JSON = words;
  private word: { id: number; char: string; locked: boolean }[] = null;
  private similarWords: string[] = null;
  private selectedChar: string = null;
  private charAdded = false;

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
    this.word = new Array<{ id: number; char: string; locked: boolean }>();
    this.charAdded = false;

    for (let i = 0; i < wordParts.length; i++) {
      this.word.push({
        id: i,
        char: wordParts[i],
        locked: true,
      });
    }
  }

  private evaluateGame() {
    const isCorrect = this.similarWords.includes(
      this.word.map((el) => el.char).join("")
    );
    this.$emit("evaluated-game", isCorrect);
  }

  private addChar(addBefore: number) {
    if (this.selectedChar === null || this.charAdded) {
      return;
    }
    this.word.splice(addBefore, 0, {
      id: Math.max(...this.word.map((el) => el.id)) + 1,
      char: this.selectedChar,
      locked: false,
    });
    this.selectedChar = null;
    this.charAdded = true;
  }

  private dragChar(event: DragEvent, id: string) {
    event.dataTransfer.setData("id", id);
  }

  private trashElement(event: DragEvent) {
    const id = +event.dataTransfer.getData("id");
    if (this.word.find((el) => el.id === id).locked) {
      return;
    }
    this.word = this.word.filter((el) => el.id !== id);
    this.charAdded = false;
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
  min-width: 1em;
  border: 1px dashed black;
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
