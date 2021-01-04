<template>
  <div>
    <div class="flex-item flex-center flex-row">
      <h2>{{ title }}</h2>
      <Tutorial :video="video" :description="description" />
    </div>
    <div id="result" class="modal">
      <div class="modal-content flex-item flex-center flex-col">
        <div>
          <img
            :src="require('@/assets/beavers/correct.png')"
            v-if="isCorrect"
          />
          <img :src="require('@/assets/beavers/wrong.png')" v-else />
        </div>
        <div>
          <h3>{{ resultText }}</h3>
        </div>
      </div>
    </div>
    <div>
      <Buttonmenu
        :restartGameText="restartGameText"
        :evaluateGameText="evaluateGameText"
      />
      <component
        :is="currentGameComponent"
        :args="args"
        @evaluated-game="(correct) => evaluatedGame(correct)"
      ></component>
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

/*
  TODO:
    - rework word list: all similar words should be valid, also words with a distance of at least 2 (swap)
    - add tutorial videos
    - check if vue slots are possible for tutorial html embedding
*/

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
  type: GameType;
  @Prop()
  title: string;
  @Prop({ type: Object, default: () => ({}) })
  args: {};
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  video: string;

  restartGameText = "Nächstes Rätsel!";
  evaluateGameText = "Überprüfen!";
  resultText = "";
  isCorrect = false;

  evaluatedGame(correct: boolean): void {
    if (correct) {
      this.resultText = "Richtig!";
      this.isCorrect = true;
    } else {
      this.resultText = "Falsch!";
      this.isCorrect = false;
    }
    const resultModal = document.getElementById("result");
    resultModal.style.display = "block";
    setTimeout(() => {
      resultModal.style.display = "none";
      this.resultText = "";
      this.isCorrect = false;
    }, 1500);
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
#result > .modal-content {
  background-color: transparent;
  border: none;
  color: white;
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
