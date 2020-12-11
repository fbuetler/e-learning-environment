<template>
  <div>
    <div class="word-container flex-item flex-row flex-center">
      <div v-for="element in word" :key="element.id">
        <div
          class="word-char card"
          :class="{
            locked: element.locked,
            selected: element.id === selectedChar,
          }"
          :id="'word-char-' + element.id"
          @click="selectChar(element.id)"
          draggable
          @dragstart="selectedChar = element.id"
          @dragover.prevent
          @dragend.prevent
          @drop.stop.prevent="selectChar(element.id)"
        >
          {{ element.char }}
        </div>
      </div>
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
          v-for="([left, right], index) in connectByArrow"
          :key="index"
          :id="`arrow-${left}-${right}`"
          stroke="black"
          stroke-width="2"
          fill="transparent"
          marker-start="url(#arrowhead)"
          marker-end="url(#arrowtail)"
          @click="swapChar(left, right)"
        />
      </svg>
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

@Component<Change>({
  components: {
    Undo,
  },
})
export default class Change extends Mixins(GameMixin) implements GameInterface {
  private dataKey = "change";
  private word: wordElement[] = null;
  private similarWords: string[] = null;
  private selectedChar: number = null;
  private randomIndex: number = null;
  private charSwaped = false;

  mounted() {
    this.connectByArrow.forEach(([leftID, rightID]) => {
      const leftDiv = document.getElementById(`word-char-${leftID}`);
      const rightDiv = document.getElementById(`word-char-${rightID}`);
      const arrow = document.getElementById(`arrow-${leftID}-${rightID}`);

      const leftDivCenter = leftDiv.offsetLeft + leftDiv.offsetWidth / 2;
      const rightDivCenter = rightDiv.offsetLeft + rightDiv.offsetWidth / 2;
      const divBottom = leftDiv.offsetTop + leftDiv.offsetHeight;
      const distanceFromBottom = 3;

      const start = {
        x: leftDivCenter + 5,
        y: divBottom + distanceFromBottom,
      };
      const anchor = {
        x: (leftDivCenter + rightDivCenter) / 2,
        y: divBottom + 30,
      };
      const end = {
        x: rightDivCenter - 5,
        y: divBottom + distanceFromBottom,
      };

      arrow.setAttribute(
        "d",
        `M ${start.x} ${start.y} ` +
          `Q ${anchor.x} ${anchor.y}, ` +
          `${end.x} ${end.y}`
      );
    });
  }

  isStarted(): boolean {
    return this.word === null;
  }

  restartGame() {
    this.word = LoadWords(this.dataKey)[0];
    this.randomIndex = Math.floor(Math.random() * (this.word.length - 1));
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);

    this.selectedChar = null;
    this.charSwaped = false;
  }

  isCorrect(): boolean {
    return this.word.reduce(
      (acc, currVal) => acc && currVal.initialChar === currVal.char,
      true
    );
  }

  selectChar(id: number) {
    if (this.selectedChar === null) {
      this.selectedChar = id;
      return;
    }
    this.swapChar(this.selectedChar, id);
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
    this.selectedChar = null;
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
    this.selectedChar = null;
    this.swap(this.word[this.randomIndex], this.word[this.randomIndex + 1]);
    this.charSwaped = false;
  }

  get connectByArrow(): [number, number][] {
    const arr = new Array<[number, number]>();
    for (let i = 0; i < this.word.length - 1; i++) {
      arr.push([this.word[i].id, this.word[i + 1].id]);
    }
    return arr;
  }
}
</script>

<style scoped>
svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
