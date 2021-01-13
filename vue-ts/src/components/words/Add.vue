<template>
  <div @dragend="selectedChar = null">
    <slot :animationSteps="animationSteps" />
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben hinzufügst.
    </div>
    <div
      class="word-container flex-item flex-col flex-center flex-flex"
      ref="word-container"
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
          :ref="`word-char-${element.id}`"
          :id="`word-char-${element.id}`"
        >
          {{ element.char }}
        </div>
        <div :ref="`word-char-${word.length}`"></div>
      </div>
      <div class="svg-container" v-if="!charAdded">
        <svg class="svg-item">
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
            :ref="`arrow-${id}`"
            :id="`arrow-${id}`"
            stroke="black"
            stroke-width="3"
            fill="transparent"
            marker-start="url(#arrowhead)"
          />
          <rect
            v-for="id in arrows"
            :key="`rect-around-arrow-${id}`"
            :ref="`rect-around-arrow-${id}`"
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
import GameMixin, { GameInterface } from "@/components/GameMixins";
import Alphabet from "@/components/words/Alphabet.vue";
import Undo from "@/components/Undo.vue";
import { LoadWords, wordElement } from "@/components/words/Words";

@Component<Add>({
  components: {
    Alphabet,
    Undo,
  },
})
export default class Add extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  similarWords: string[] = null;
  selectedChar: string = null;
  charAdded = false;

  animationSteps: Array<string> = null;

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
    [this.word, this.similarWords] = LoadWords("add", 1);
    this.word.forEach((el) => (el.locked = true));
    this.charAdded = false;
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect() {
    return this.similarWords.includes(this.word.map((el) => el.char).join(""));
  }

  drawArrows() {
    if (this.charAdded) {
      return;
    }
    this.arrows.forEach((id) => {
      const container = this.$refs["word-container"] as HTMLElement;
      let char: HTMLElement;
      if (id === this.word.length) {
        char = this.$refs[`word-char-${id}`] as HTMLElement;
      } else {
        // When ref is used together with v-for, the ref you get will be an array
        char = this.$refs[`word-char-${id}`][0] as HTMLElement;
      }
      const arrow = this.$refs[`arrow-${id}`][0] as SVGElement;
      const rect = this.$refs[`rect-around-arrow-${id}`][0] as SVGElement;

      const xPos = char.offsetLeft - container.offsetLeft;
      const yPos = 10;
      const width = 40;
      const height = 40;

      arrow.setAttribute("x1", `${xPos}`);
      arrow.setAttribute("y1", `${yPos}`);
      arrow.setAttribute("x2", `${xPos}`);
      arrow.setAttribute("y2", `${yPos + height}`);

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

  getAnimationSteps(): Array<string> {
    const [correctPos, correctChar] = this.findFirstDiffPos(
      this.word.map((el) => el.char).join(""),
      this.similarWords[0]
    );
    let wrongChar: string;
    let wrongPos: number;
    do {
      wrongChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } while (wrongChar === correctChar);
    do {
      wrongPos = Math.floor(Math.random() * this.word.length + 1);
    } while (wrongPos === correctPos);

    return new Array<string>(
      `alphabet-${wrongChar}`,
      `rect-around-arrow-${wrongPos}`,
      "button-menu-check",
      "undo",
      `alphabet-${correctChar}`,
      `rect-around-arrow-${correctPos}`,
      "button-menu-check",
      "button-menu-next"
    );
  }

  findFirstDiffPos(a: string, b: string): [number, string] {
    let i = 0;
    while (a[i] === b[i]) {
      i++;
    }
    return [i, b[i]];
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
.svg-item {
  width: 100%;
  max-height: 3em;
  overflow: visible;
}
</style>
