<template>
  <div>
    <div class="word-container">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char"
          :class="{
            'word-char-locked': element.locked,
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
      <Trashcan
        @trashed-element="trashElement($event)"
        @click="trashElement()"
      />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";
import { EventBus, EventBusEvents } from "../EventBus";
import { LoadWords, wordElement } from "./LoadWords";

@Component<Remove>({
  components: {
    Trashcan,
    Undo,
  },
})
export default class Remove extends Vue {
  @Prop({ required: true })
  private args!: {};

  private dataKey = "remove";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: number = null;
  private charRemoved = false;

  created() {
    if (this.word === null) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  private restartGame() {
    [this.word, this.similarWords] = LoadWords(this.dataKey);
    this.selectedChar = null;
    this.charRemoved = false;
  }

  private evaluateGame() {
    const isCorrect = this.similarWords.includes(
      this.word.map((el) => el.char).join("")
    );
    this.$emit("evaluated-game", isCorrect);
  }

  private trashElement() {
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

  private undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.selectedChar = null;
    this.charRemoved = false;
  }
}
</script>
