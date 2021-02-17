<template>
  <div @dragend="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <div>
      Versuch ein neues Wort zu bilden, indem du einen Buchstaben hinzufügst.
    </div>
    <div
      id="word-container"
      ref="word-container"
      class="word-container flex-item flex-col flex-center flex-flex"
    >
      <div class="flex-item flex-row flex-center">
        <div
          v-for="element in word"
          :id="`word-char-${element.id}`"
          :ref="`word-char-${element.id}`"
          :key="element.id"
          :class="{
            locked: element.locked,
          }"
          class="word-char card"
        >
          {{ element.char }}
        </div>
        <div :ref="`word-char-${word.length}`"></div>
      </div>
      <div v-if="!charAdded" class="svg-container">
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
            :id="`arrow-${id}`"
            :ref="`arrow-${id}`"
            :key="`arrow-${id}`"
            stroke="black"
            stroke-width="3"
            fill="transparent"
            marker-start="url(#arrowhead)"
          />
          <rect
            v-for="id in arrows"
            :id="`rect-around-arrow-${id}`"
            :ref="`rect-around-arrow-${id}`"
            :key="`rect-around-arrow-${id}`"
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
      class="interaction-container flex-item flex-row flex-center flex-stretch flex-wrap"
    >
      <ItemSelection
        :selected="selected"
        :items="items"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import ItemSelection, { item } from "@/components/shared/ItemSelection.vue";
import Undo from "@/components/shared/Undo.vue";
import {
  LoadWords,
  wordElement,
  alphabet,
  items,
  findCorrectAndWrongSolutions,
} from "@/components/words/Words";

@Component<Add>({
  components: {
    ItemSelection,
    Undo,
  },
})
export default class Add extends Mixins(GameMixin) implements GameInterface {
  word: wordElement[] = null;
  similarWords: string[] = null;
  selected: number = null;
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

  isInitialized(): boolean {
    return this.word !== null;
  }

  start() {
    [this.word, this.similarWords] = LoadWords("add", 1);
    this.word.forEach((el) => (el.locked = true));
    this.selected = null;
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
    if (this.selected === null || this.charAdded) {
      return;
    }
    this.word.splice(addBefore, 0, {
      id: Math.max(...this.word.map((el) => el.id)) + 1,
      char: alphabet[this.selected],
      initialChar: "",
      locked: false,
    });
    this.selected = null;
    this.charAdded = true;
  }

  undo() {
    this.word = this.word.filter((el) => el.locked);
    this.charAdded = false;
  }

  getAnimationSteps(): Array<string> {
    const [
      correctPos,
      correctChar,
      wrongPos,
      wrongChar,
    ] = findCorrectAndWrongSolutions(
      this.word.map((el) => el.char).join(""),
      this.similarWords[0]
    );

    return new Array<string>(
      `item-selection-${alphabet.findIndex((el) => el === wrongChar)}`,
      `rect-around-arrow-${wrongPos}`,
      "button-menu-check",
      "undo",
      `item-selection-${alphabet.findIndex((el) => el === correctChar)}`,
      `rect-around-arrow-${correctPos}`,
      "button-menu-check",
      "button-menu-next"
    );
  }

  get arrows(): number[] {
    const arrows = new Array<number>();
    for (let i = 0; i <= this.word.length; i++) {
      arrows.push(i);
    }
    return arrows;
  }

  get items(): item[] {
    return items;
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
