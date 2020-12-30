<template>
  <div @dragend="selectedChar = null">
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben hinzufügst.
    </div>
    <div
      class="word-container flex-item flex-col flex-center flex-flex"
      id="word-container"
    >
      <div class="flex-item flex-row flex-center">
        <div
          v-for="element in word"
          :key="element.id"
          class="word-char card"
          :class="{
            locked: element.locked,
          }"
          :id="`word-char-${element.id}`"
        >
          {{ element.char }}
        </div>
        <div :id="`word-char-${word.length}`"></div>
      </div>
      <div class="svg-container" v-if="!charAdded">
        <svg>
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 5 L 10 0 L 10 10 z" />
            </marker>
          </defs>
          <line
            v-for="id in arrows"
            :key="`arrow-${id}`"
            :id="`arrow-${id}`"
            stroke="black"
            stroke-width="3"
            fill="transparent"
            marker-start="url(#arrowhead)"
          />
          <rect
            v-for="id in arrows"
            :key="`rect-around-arrow-${id}`"
            :id="`rect-around-arrow-${id}`"
            fill="transparent"
            @click="addChar(id)"
            @dragenter.prevent
            @dragover.prevent
            @drop.stop.prevent="addChar(id)"
          />
        </svg>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <Alphabet
        :selectedChar="selectedChar"
        @char-selected="selectedChar = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Alphabet from "@/components/words/Alphabet.vue";
import Undo from "@/components/Undo.vue";
import { LoadWords, wordElement } from "./Words";

@Component<Add>({
  components: {
    Alphabet,
    Undo,
  },
})
export default class Add extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "add";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: string = null;
  private charAdded = false;

  created() {
    window.addEventListener("resize", this.drawArrows);
  }
  destroyed() {
    window.removeEventListener("resize", this.drawArrows);
  }

  mounted() {
    this.drawArrows();
  }

  updated() {
    this.drawArrows();
  }

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    [this.word, this.similarWords] = LoadWords(this.dataKey);
    this.word.forEach((el) => (el.locked = true));
    this.charAdded = false;
  }

  isCorrect() {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  drawArrows() {
    if (this.charAdded) {
      return;
    }
    this.arrows.forEach((id) => {
      const container = document.getElementById("word-container");
      let char = document.getElementById(`word-char-${id}`);
      const arrow = document.getElementById(`arrow-${id}`);
      const rect = document.getElementById(`rect-around-arrow-${id}`);

      const xPos = char.offsetLeft - container.offsetLeft;
      const yPos = 10;
      const width = 40;
      const height = 40;
      const start = {
        x: xPos,
        y: yPos,
      };
      const end = {
        x: xPos,
        y: yPos + height,
      };

      arrow.setAttribute("x1", `${start.x}`);
      arrow.setAttribute("y1", `${start.y}`);
      arrow.setAttribute("x2", `${end.x}`);
      arrow.setAttribute("y2", `${end.y}`);

      if (id === this.word.length) {
        char = document.getElementById(`word-char-${id - 1}`);
      }
      rect.setAttribute("x", `${xPos - width / 2}`);
      rect.setAttribute(
        "y",
        `${-(char.offsetTop - container.offsetTop + char.clientHeight + yPos)}`
      );
      rect.setAttribute("width", `${width}`);
      rect.setAttribute("height", `${container.clientHeight}`);
    });
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

  undo() {
    this.word = this.word.filter((el) => el.locked);
    this.charAdded = false;
  }

  get arrows(): number[] {
    const arrows = new Array<number>();
    for (let i = 0; i <= this.word.length; i++) {
      arrows.push(i);
    }
    return arrows;
  }
}
</script>

<style scoped>
.svg-container {
  width: 100%;
}
svg {
  width: 100%;
  max-height: 3em;
  overflow: visible;
}
</style>
