<template>
  <div>
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficultyLevel($event)"
    />
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
          :id="'word-char-' + element.id"
        >
          {{ element.char }}
        </div>
      </div>
      <div class="svg-container">
        <svg class="svg-item">
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
import Difficulty from "@/components/Difficulty.vue";
import { LoadWords, wordElement } from "./Words";

@Component<Change>({
  components: {
    Undo,
    Difficulty,
  },
})
export default class Change extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  wordPerLevel = new Map<number, wordElement[]>();
  swapIndexesPerLevel = new Map<number, [number, number][]>();

  difficultyLevels = 2;
  currentDifficultyLevel = 1;

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
    this.wordPerLevel = new Map<number, wordElement[]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      const word = LoadWords("change", level)[0];
      this.wordPerLevel.set(level, word);
      this.swapIndexesPerLevel.set(
        level,
        this.getSwapPairs(word.length, level)
      );
    }
    this.prepareWord();
  }

  isCorrect(): boolean {
    return this.wordPerLevel
      .get(this.currentDifficultyLevel)
      .every((currVal) => currVal.initialChar === currVal.char);
  }

  getSwapPairs(length: number, swapAmount: number): Array<[number, number]> {
    const pairs = new Array<[number, number]>();
    const free = new Array<boolean>(length).fill(true);
    for (let j = 1; j <= swapAmount && 2 * j <= length; j++) {
      let index: number;
      do {
        // is there any pair available
        if (
          !free.some((_, i, arr) =>
            i < arr.length - 1 ? arr[i] && arr[i + 1] : false
          )
        ) {
          return pairs;
        }
        index = Math.floor(Math.random() * length - 1);
      } while (!free[index] || !free[index + 1]);
      free[index] = false;
      free[index + 1] = false;
      pairs.push([index, index + 1]);
    }
    return pairs;
  }

  swapChar(leftID: number, rightID: number) {
    const left = this.word.findIndex((el) => el.id === leftID);
    const right = this.word.findIndex((el) => el.id === rightID);

    const tmp = this.word[left].char;
    this.word[left].char = this.word[right].char;
    this.word[right].char = tmp;
  }

  undo() {
    this.word.forEach((el) => (el.char = el.initialChar));
    this.prepareWord();
  }

  changeDifficultyLevel(newLevel: number) {
    this.currentDifficultyLevel = newLevel;
    this.prepareWord();
  }

  prepareWord() {
    const word = this.wordPerLevel.get(this.currentDifficultyLevel);
    const swapIndexes = this.swapIndexesPerLevel.get(
      this.currentDifficultyLevel
    );

    swapIndexes.forEach(([left, right]) => {
      word[left].char = word[right].initialChar;
      word[right].char = word[left].initialChar;
    });

    this.word = word;
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

  get arrows(): [number, number][] {
    const arrows = new Array<[number, number]>();
    const word = this.word;
    for (let i = 0; i < word.length - 1; i++) {
      arrows.push([word[i].id, word[i + 1].id]);
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
  max-height: 2em;
}
</style>
