<template>
  <div>
    <div class="flex-item flex-center flex-row">
      <h2>{{ title }}</h2>
      <Tutorial :video="video" :description="description" />
    </div>
    <div v-if="showResult">
      <img :src="require('@/assets/beavers/correct.png')" v-if="isCorrect" />
      <img :src="require('@/assets/beavers/wrong.png')" v-else />
      <h3>{{ resultText }}</h3>
    </div>
    <div v-else>
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Buttonmenu from "@/components/Buttonmenu.vue";
import Tutorial from "@/components/Tutorial.vue";
import TreeRow from "@/components/trees/Row.vue";
import TreeSudoku from "@/components/trees/Sudoku.vue";
import WordsAdd from "@/components/words/Add.vue";
import WordsChange from "@/components/words/Change.vue";
import WordsRemove from "@/components/words/Remove.vue";
import WordsSwap from "@/components/words/Swap.vue";
import MayasTo from "@/components/mayas/To.vue";
import MayasFrom from "@/components/mayas/From.vue";
import MayasAddition from "@/components/mayas/Addition.vue";
import SymbolEncryption from "@/components/ciphertexts/SymbolEncryption.vue";
import SymbolDecryption from "@/components/ciphertexts/SymbolDecryption.vue";
import PatternEncryption from "@/components/ciphertexts/PatternEncryption.vue";
import PatternDecryption from "@/components/ciphertexts/PatternDecryption.vue";
import CoinsFrom from "@/components/coins/From.vue";
import CoinsMinimalAmount from "@/components/coins/MinimalAmount.vue";
import CoinsSwap from "@/components/coins/Swap.vue";
import CoinsTo from "@/components/coins/To.vue";

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
  SYMBOLENCRYPTION = "SymbolEncryption",
  SYMBOLDECRYPTION = "SymbolDecryption",
  PATTERNENCRYPTION = "PatternEncryption",
  PATTERNDECRYPTION = "PatternDecryption",
  COINSFROM = "CoinsFrom",
  COINSMINIMALAMOUNT = "CoinsMinimalAmount",
  COINSSWAP = "CoinsSwap",
  COINSTO = "CoinsTo",
}

@Component({
  components: {
    Buttonmenu,
    Tutorial,
    TreeRow,
    TreeSudoku,
    WordsAdd,
    WordsChange,
    WordsRemove,
    WordsSwap,
    MayasTo,
    MayasFrom,
    MayasAddition,
    SymbolEncryption,
    SymbolDecryption,
    PatternEncryption,
    PatternDecryption,
    CoinsFrom,
    CoinsMinimalAmount,
    CoinsSwap,
    CoinsTo,
  },
})
export default class Game extends Vue {
  @Prop({ required: true })
  private type: GameType;
  @Prop()
  private title: string;
  @Prop({ type: Object, default: () => ({}) })
  private args: {};
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;

  private restartGameText = "Neu starten!";
  private evaluateGameText = "Überprüfen!";
  private resultText = "";
  private isCorrect = false;
  private showResult = false;

  private evaluatedGame(correct: boolean): void {
    if (correct) {
      this.resultText = "Richtig!";
      this.isCorrect = true;
    } else {
      this.resultText = "Falsch!";
      this.isCorrect = false;
    }
    this.showResult = true;
    setTimeout(() => {
      this.showResult = false;
      this.resultText = "";
      this.isCorrect = false;
    }, 2000);
  }

  get currentGameComponent() {
    return this.type;
  }
}
</script>

<style>
.selected {
  background: #eeee4e !important;
  border: 3px solid #dbdb47;
}
.locked {
  background: lightgray !important;
  border: 3px solid #cccccc;
}

/* the special snowflakes */
.word-container {
  margin: 1em;
}
.word-char {
  padding: 0.3em;
  margin: 0.2em;
  font-size: 2em;
}
.interaction-container > div {
  margin: 1em;
}
.tree-dropzone {
  align-items: flex-end;
  min-height: 9em;
  min-width: 5em;
  margin: 0.1em;
}
.nut > img {
  max-width: 64px;
}
.stick > img {
  max-height: 96px;
}
</style>
