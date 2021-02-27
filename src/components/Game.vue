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
        <div class="responsive">
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
import Buttonmenu from "@/components/shared/Buttonmenu.vue";
import Tutorial from "@/components/shared/Tutorial.vue";
import TutorialAnimation from "@/components/shared/TutorialAnimation.vue";
import Modal from "@/components/shared/Modal.vue";
import TreeRow from "@/components/trees/Row.vue";
import TreeSudoku from "@/components/trees/Sudoku.vue";
import WordsAdd from "@/components/words/Add.vue";
import WordsChange from "@/components/words/Change.vue";
import WordsRemove from "@/components/words/Remove.vue";
import WordsSwap from "@/components/words/Swap.vue";
import SymbolEncryption from "@/components/ciphertexts/SymbolEncryption.vue";
import SymbolDecryption from "@/components/ciphertexts/SymbolDecryption.vue";
import PatternEncryption from "@/components/ciphertexts/PatternEncryption.vue";
import PatternDecryption from "@/components/ciphertexts/PatternDecryption.vue";
import NumberSystemsTo from "@/components/numbersystems/To.vue";
import NumberSystemsFrom from "@/components/numbersystems/From.vue";
import NumberSystemsSwap from "@/components/numbersystems/Swap.vue";
import NumberSystemsAddition from "@/components/numbersystems/Addition.vue";

export enum GameType {
  TREEROW = "TreeRow",
  TREESUDOKU = "TreeSudoku",
  WORDSADD = "WordsAdd",
  WORDSCHANGE = "WordsChange",
  WORDSREMOVE = "WordsRemove",
  WORDSSWAP = "WordsSwap",
  SYMBOLENCRYPTION = "SymbolEncryption",
  SYMBOLDECRYPTION = "SymbolDecryption",
  PATTERNENCRYPTION = "PatternEncryption",
  PATTERNDECRYPTION = "PatternDecryption",
  NUMBERSYSTEMSTO = "NumberSystemsTo",
  NUMBERSYSTEMSFROM = "NumberSystemsFrom",
  NUMBERSYSTEMSSWAP = "NumberSystemsSwap",
  NUMBERSYSTEMSADDITION = "NumberSystemsAddition",
}

/*
  TODO:
    - reorder buttons: next, check, difficulty, undo, trashcan, tutorial
    - visual feedback for wrong input e.g in binary coins/to (search for shake func)
    - symbol/encryption does not provide content: what to do?
    - optional: unit tests for each function
    - optional: add difficulty level to numbersystems/swap: minimal items 
    - optional: mouse click effect in tutorial videos
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
    SymbolEncryption,
    SymbolDecryption,
    PatternEncryption,
    PatternDecryption,
    NumberSystemsTo,
    NumberSystemsFrom,
    NumberSystemsSwap,
    NumberSystemsAddition,
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

<style scoped></style>
