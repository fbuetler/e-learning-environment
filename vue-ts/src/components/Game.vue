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
