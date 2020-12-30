<template>
  <div>
    <div>
      Versuch ein neues Wort zu bilden, indem du zwei Buchstaben vertauschst.
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
          :id="'word-char-' + element.id"
        >
          {{ element.char }}
        </div>
      </div>
      <div class="svg-container">
        <svg>
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="0"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 10 0 L 0 5 L 10 10 z" />
            </marker>
            <marker
              id="arrowtail"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <path
            v-for="[left, right] in arrows"
            :key="`arrow-${left}-${right}`"
            :id="`arrow-${left}-${right}`"
            stroke="black"
            stroke-width="2"
            fill="transparent"
            marker-start="url(#arrowhead)"
            marker-end="url(#arrowtail)"
            @click="swapChar(left, right)"
          />
          <rect
            v-for="[left, right] in arrows"
            :key="`rect-around-arrow-${left}-${right}`"
            :id="`rect-around-arrow-${left}-${right}`"
            fill="transparent"
            @click="swapChar(left, right)"
          />
        </svg>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import Undo from "@/components/Undo.vue";
import { LoadWords, wordElement } from "./Words";

/*
  TODO:
    - add more difficulty levels
*/

@Component<Change>({
  components: {
    Undo,
  },
})
export default class Change extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "change";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private randomIndex: number = null;
  private charSwaped = false;

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
    this.word = LoadWords(this.dataKey)[0];
    this.randomIndex = Math.floor(Math.random() * (this.word.length - 1));
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);

    this.charSwaped = false;
  }

  isCorrect(): boolean {
    return this.word.reduce(
      (acc, currVal) => acc && currVal.initialChar === currVal.char,
      true
    );
  }

  drawArrows() {
    this.arrows.forEach(([leftID, rightID]) => {
      const container = document.getElementById("word-container");
      const leftChar = document.getElementById(`word-char-${leftID}`);
      const rightChar = document.getElementById(`word-char-${rightID}`);
      const arrow = document.getElementById(`arrow-${leftID}-${rightID}`);
      const rect = document.getElementById(
        `rect-around-arrow-${leftID}-${rightID}`
      );

      const leftCharCenter =
        leftChar.offsetLeft - container.offsetLeft + leftChar.offsetWidth / 2;
      const rightCharCenter =
        rightChar.offsetLeft - container.offsetLeft + rightChar.offsetWidth / 2;

      const xPosLeft = leftCharCenter + 5;
      const xPosRight = rightCharCenter - 5;
      const yPos = 0;
      const height = 30;
      const width = xPosRight - xPosLeft;
      const start = {
        x: xPosLeft,
        y: yPos,
      };
      const anchor = {
        x: (xPosLeft + xPosRight) / 2,
        y: yPos + height,
      };
      const end = {
        x: xPosRight,
        y: yPos,
      };

      arrow.setAttribute(
        "d",
        `M ${start.x} ${start.y} ` +
          `Q ${anchor.x} ${anchor.y}, ` +
          `${end.x} ${end.y}`
      );
      rect.setAttribute("x", `${xPosLeft}`);
      rect.setAttribute("y", `${yPos}`);
      rect.setAttribute("width", `${width}`);
      rect.setAttribute("height", `${1.5 * height}`);
    });
  }

  swapChar(leftID: number, rightID: number) {
    if (this.charSwaped) {
      return;
    }

    this.swap(
      this.word.find((el) => el.id === leftID),
      this.word.find((el) => el.id === rightID)
    );

    this.word.forEach((el) => (el.locked = true));
    this.charSwaped = true;
  }

  swap(a: wordElement, b: wordElement) {
    const temp = a.char;
    a.char = b.char;
    b.char = temp;
  }

  undo() {
    this.word.forEach((el) => {
      el.char = el.initialChar;
      el.locked = false;
    });
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);
    this.charSwaped = false;
  }

  get arrows(): [number, number][] {
    const arrrows = new Array<[number, number]>();
    for (let i = 0; i < this.word.length - 1; i++) {
      arrrows.push([this.word[i].id, this.word[i + 1].id]);
    }
    return arrrows;
  }
}
</script>

<style scoped>
.svg-container {
  width: 100%;
}
svg {
  width: 100%;
  max-height: 2em;
}
</style>
