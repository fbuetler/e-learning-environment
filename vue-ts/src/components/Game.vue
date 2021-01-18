<template>
  <div id="game">
    <div class="flex-item flex-center flex-row">
      <slot name="title">Unintentionally empty!</slot>
      <Tutorial @start-tutorial-animation="showAnimation = true">
        <slot name="description" slot="description" />
        <slot name="video" slot="video" />
      </Tutorial>
    </div>
    <Modal v-if="showResult" id="result" @close="showResult = false">
      <div slot="body" class="flex-item flex-center flex-col">
        <div>
          <img
            v-if="isCorrect"
            :src="require('@/assets/beavers/correct.png')"
          />
          <img v-else :src="require('@/assets/beavers/wrong.png')" />
        </div>
        <div>
          <h3>{{ resultText }}</h3>
        </div>
      </div>
    </Modal>
    <div>
      <Buttonmenu />
      <component
        :is="currentGameComponent"
        id="task"
        :args="args"
        @evaluated-game="(correct) => evaluatedGame(correct)"
      >
        <TutorialAnimation
          v-if="showAnimation"
          id="tutorial-animation"
          slot="animation"
          slot-scope="slotScope"
          :steps="slotScope.animationSteps"
          @finished="showAnimation = false"
        />
      </component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Buttonmenu from "@/components/Buttonmenu.vue";
import Tutorial from "@/components/Tutorial.vue";
import TutorialAnimation from "@/components/TutorialAnimation.vue";
import Modal from "@/components/Modal.vue";
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
  COINSSWAP = "CoinsSwap",
  COINSTO = "CoinsTo",
}

/*
  TODO:
    - test that shit
    - optional: multilingual (vue-i18n)
    - optional: union To, From from mayas and coins
    - optional: move parts of number systems task into components
*/

@Component({
  components: {
    Buttonmenu,
    Tutorial,
    TutorialAnimation,
    Modal,
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
    CoinsSwap,
    CoinsTo,
  },
})
export default class Game extends Vue {
  @Prop({ required: true })
  type: GameType;
  @Prop({ type: Object, default: () => ({}) })
  args: {};

  resultText = "";
  isCorrect = false;
  showResult = false;
  showAnimation = false;

  evaluatedGame(correct: boolean): void {
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

.description > p {
  margin: 1em;
  text-align: justify;
}
.video > video {
  max-height: 100%;
  max-width: 100%;
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
.coin > img {
  max-width: 64px;
}
</style>
