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

export enum GameType {
  TREEROW = "TreeRow",
  TREESUDOKU = "TreeSudoku",
  WORDSADD = "WordsAdd",
  WORDSCHANGE = "WordsChange",
  WORDSREMOVE = "WordsRemove",
  WORDSSWAP = "WordsSwap",
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
.word-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em;
}
.word-char {
  background: white;
  border: 3px solid black;
  padding: 0.3em;
  margin: 0.2em;
}
.interaction-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
.tree-view {
  background: darkgray;
}
.tree-container {
  display: grid;
  background: white;
  border: 3px solid black;
  margin: 0px 0px 25px 0px;
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
hr {
  border: 1px solid black;
}
.selected {
  background: #eeee4e !important;
}
.locked {
  background: lightgray !important;
}
</style>
