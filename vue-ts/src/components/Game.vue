<template>
  <div>
    <h2>{{ title }}</h2>
    <Buttonmenu
      :restartGameText="restartGameText"
      :evaluateGameText="evaluateGameText"
    />
    <keep-alive :max="1">
      <component
        v-if="!showResult"
        :is="currentGameComponent"
        :args="args"
        @evaluated-game="(correct) => evaluatedGame(correct)"
      ></component>
    </keep-alive>
    <div v-if="showResult">
      <h3>{{ resultText }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Buttonmenu from "@/components/Buttonmenu.vue";
import TreeRow from "@/components/trees/Row.vue";
import TreeSudoku from "@/components/trees/Sudoku.vue";
import WordsAdd from "@/components/words/Add.vue";
import WordsChange from "@/components/words/Change.vue";
import WordsRemove from "@/components/words/Remove.vue";
import WordsSwap from "@/components/words/Swap.vue";
import MayasTo from "@/components/mayas/To.vue";
import MayasFrom from "@/components/mayas/From.vue";
import MayasAddition from "@/components/mayas/Addition.vue";

export enum GameType {
  TREEROW = "TreeRow",
  TREESUDOKU = "TreeSudoku",
  WORDSADD = "WordsAdd",
  WORDSCHANGE = "WordsChange",
  WORDSREMOVE = "WordsRemove",
  WORDSSWAP = "WordsSwap",
  MAYASTO = "MayasTo",
  MAYASFROM = "MayasFrom",
  MAYASADDITION = "MayasAddition",
}

@Component({
  components: {
    Buttonmenu,
    TreeRow,
    TreeSudoku,
    WordsAdd,
    WordsChange,
    WordsRemove,
    WordsSwap,
    MayasTo,
    MayasFrom,
    MayasAddition,
  },
})
export default class Game extends Vue {
  @Prop({ required: true })
  private type: GameType;
  @Prop()
  private title: string;
  @Prop({ type: Object, default: () => ({}) })
  private args: {};

  private restartGameText = "Neu starten!";
  private evaluateGameText = "Überprüfen!";
  private resultText = "";
  private showResult = false;

  private evaluatedGame(correct: boolean): void {
    if (correct) {
      this.resultText = "Richtig!";
    } else {
      this.resultText = "Falsch!";
    }
    this.showResult = true;
    setTimeout(() => {
      this.showResult = false;
      this.resultText = "";
    }, 2000);
  }

  get currentGameComponent() {
    return this.type;
  }
}
</script>

<style>
.flex-item {
  display: flex;
}
.flex-warp {
  flex-wrap: wrap;
}
.flex-center {
  align-items: center;
  justify-content: center;
}
.flex-stretch {
  align-items: stretch;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-flex {
  flex: 1;
}
.word-container {
  margin: 1em;
}
.word-char {
  padding: 0.3em;
  margin: 0.2em;
}
.card {
  border-radius: 5px;
  background: white;
  border: 3px solid #e7e7e7;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.tree-view {
  background: darkgray;
}
.tree-container {
  display: grid;
  background: white;
  border: 3px solid black;
}
.tree-row > div {
  grid-row: 1;
  border: 1px solid gray;
  font-size: 3em;

  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.tree-row > div > img {
  max-height: 50%;
}
.interaction-container > div {
  margin: 1rem;
}
.selected {
  background: #eeee4e !important;
  border: 3px solid #dbdb47;
}
.locked {
  background: lightgray !important;
  border: 3px solid #cccccc;
}
hr {
  border: 1px solid black;
}
</style>
