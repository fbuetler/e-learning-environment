<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="changeDifficultyLevel($event)"
    />
    <div>
      Versuche ein sinnvolles Wort zu bilden, indem du
      <b v-if="currentDifficultyLevel === 1">einmal</b>
      <b v-if="currentDifficultyLevel === 2">zweimal</b>
      zwei Buchstaben vertauschst.
    </div>
    <div
      id="word-container"
      ref="word-container"
      class="word-container flex-item flex-col flex-center flex-flex"
    >
      <div class="flex-item flex-row flex-center">
        <div
          v-for="element in word"
          :key="element.id"
          :id="'word-char-' + element.id"
          :ref="'word-char-' + element.id"
          class="word-char card locked"
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
            :id="`arrow-${left}-${right}`"
            :ref="`arrow-${left}-${right}`"
            :key="`arrow-${left}-${right}`"
            stroke="black"
            stroke-width="2"
            fill="transparent"
            marker-start="url(#arrowhead)"
            marker-end="url(#arrowtail)"
          />
          <rect
            v-for="[left, right] in arrows"
            :id="`rect-around-arrow-${left}-${right}`"
            :ref="`rect-around-arrow-${left}-${right}`"
            :key="`rect-around-arrow-${left}-${right}`"
            class="clickable"
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
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import Undo from "@/components/shared/Undo.vue";
import Difficulty from "@/components/shared/Difficulty.vue";
import { LoadWords, wordElement } from "@/components/words/Words";

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
  animationSteps: Array<string> = null;

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

  isInitialized(): boolean {
    return this.word !== null;
  }

  start() {
    this.wordPerLevel = new Map<number, wordElement[]>();
    for (let level = 1; level <= this.difficultyLevels; level++) {
      const word = LoadWords("change", level)[0];
      this.wordPerLevel.set(level, word);
      let swapIndexes: Array<[number, number]>;
      do {
        swapIndexes = this.getSwapPairs(word.length, level);
      } while (
        swapIndexes.some(
          ([left, right]) => word[left].initialChar === word[right].initialChar
        )
      );
      this.swapIndexesPerLevel.set(level, swapIndexes);
    }
    this.prepareWord();
    this.animationSteps = this.getAnimationSteps();
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
        index = Math.floor(this.randomNumber(length - 1));
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
      const container = this.$refs["word-container"] as HTMLElement;
      const leftChar = this.$refs[`word-char-${leftID}`][0] as HTMLElement;
      const rightChar = this.$refs[`word-char-${rightID}`][0] as HTMLElement;
      const arrow = this.$refs[`arrow-${leftID}-${rightID}`][0] as SVGElement;
      const rect = this.$refs[
        `rect-around-arrow-${leftID}-${rightID}`
      ][0] as SVGElement;

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

  getAnimationSteps(): Array<string> {
    const correctSwapIndexes = this.swapIndexesPerLevel.get(
      this.currentDifficultyLevel
    );
    let wrongSwapIndexes: Array<[number, number]>;
    do {
      wrongSwapIndexes = new Array<[number, number]>();
      const available = Array.from(Array(this.word.length - 1).keys());
      for (let i = 0; i < correctSwapIndexes.length; i++) {
        const leftIndex = Math.floor(this.randomNumber(available.length - 1));
        const left = available[leftIndex];
        available.splice(leftIndex, 1);
        wrongSwapIndexes.push([left, left + 1]);
      }

      correctSwapIndexes.sort();
      wrongSwapIndexes.sort();
    } while (
      JSON.stringify(correctSwapIndexes) === JSON.stringify(wrongSwapIndexes)
    );

    return wrongSwapIndexes
      .map(
        ([wrongLeft, wrongRight]) =>
          `rect-around-arrow-${wrongLeft}-${wrongRight}`
      )
      .concat(["button-menu-check", "undo"])
      .concat(
        correctSwapIndexes.map(
          ([correctLeft, correctRight]) =>
            `rect-around-arrow-${correctLeft}-${correctRight}`
        )
      )
      .concat(["button-menu-check", "button-menu-next"]);
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
