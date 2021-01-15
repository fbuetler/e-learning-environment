<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="
        currentDifficultyLevel = $event;
        restartGame();
      "
      v
    />
    <div>Was ist die Summe der Zahlen, die hier zusammen addiert werden?</div>
    <div class="flex-item flex-wrap flex-center flex-row">
      <div
        class="flex-item flex-wrap flex-center flex-row flex-flex"
        v-for="(summand, index) in summands"
        :key="index"
      >
        <div class="flex-item flex-center flex-col flex-flex card">
          <div class="flex-item flex-center flex-row">
            <div class="nut" v-for="nutIndex in summand[nut]" :key="nutIndex">
              <img :src="require('@/assets/mayas/nut.png')" />
            </div>
          </div>
          <div class="flex-item flex-center flex-col">
            <div
              class="stick"
              v-for="stickIndex in summand[stick]"
              :key="stickIndex"
            >
              <img :src="require('@/assets/mayas/stick.png')" />
            </div>
          </div>
        </div>
        <div v-if="!(index === summands.length - 1)">+</div>
        <div v-else>=</div>
      </div>
      <div v-if="currentDifficultyLevel === 1">
        <input
          id="answer-input"
          class="card big-text"
          size="5"
          v-model.number="sum"
          type="number"
        />
      </div>
      <div
        id="dropzone"
        class="flex-item flex-center flex-col flex-flex dropzone input"
        v-else
        @click="addItem()"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="addItem()"
      >
        <div v-if="selectedItems[nut] === 0 && selectedItems[stick] === 0">
          Platziere hier die Nüsse und Stöcke
        </div>
        <div v-else>
          <div class="flex-item flex-center flex-row">
            <div class="nut" v-for="index in selectedItems[nut]" :key="index">
              <img :src="require('@/assets/mayas/nut.png')" />
            </div>
          </div>
          <div class="flex-item flex-center flex-col">
            <div
              class="stick"
              v-for="index in selectedItems[stick]"
              :key="index"
            >
              <img :src="require('@/assets/mayas/stick.png')" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
      v-if="currentDifficultyLevel === 2"
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
import { Vue, Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import MayasMixin, { itemType } from "@/components/mayas/MayasMixin.vue";
import Difficulty from "@/components/Difficulty.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";

@Component<Addition>({
  components: {
    Difficulty,
    ItemSelection,
    Undo,
  },
})
export default class Addition extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  sum: number = null;
  solution: number = null;
  summands: Array<Array<itemType>> = null; // unfortunately Maps and Sets are not reactive in vue 2
  selected: itemType = null;
  selectedItems: Array<itemType> = null;
  animationSteps: Array<string> = null;

  limit = 19;
  numberOfSummands = 2;

  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isStarted(): boolean {
    return this.summands === null;
  }

  restartGame() {
    this.selected = null;
    this.sum = null;
    this.summands = new Array(this.numberOfSummands);
    let sum: number;
    do {
      sum = 0;
      for (let i = 0; i < this.summands.length; i++) {
        const summand = this.generateItems();
        this.summands[i] = summand;
        sum += this.sumItems(summand);
      }
    } while (sum > this.limit);
    this.solution = sum;
    // level 2
    this.selectedItems = new Array<number>(
      Object.keys(itemType).length / 2
    ).fill(0);
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    if (this.currentDifficultyLevel === 1) {
      return this.sum === this.solution;
    } else {
      if (this.selectedItems[itemType.NUT] > 4) {
        return false;
      }
      return this.sumItems(this.selectedItems) === this.solution;
    }
  }

  addItem() {
    if (this.selected === null) {
      return;
    }
    Vue.set(
      this.selectedItems,
      this.selected,
      this.selectedItems[this.selected] + 1
    );
    this.selected = null;
  }

  undo() {
    for (let i = 0; i < this.selectedItems.length; i++) {
      Vue.set(this.selectedItems, i, 0);
    }
  }

  getAnimationSteps(): Array<string> {
    const correctNumber = this.solution;
    const wrongNumber = Math.ceil(Math.random() * this.limit);

    if (this.currentDifficultyLevel === 1) {
      return [
        `answer-input:${wrongNumber}`,
        "button-menu-check",
        `answer-input:${correctNumber}`,
        "button-menu-check",
        "button-menu-next",
      ];
    } else {
      return this.mapNumberToActions(wrongNumber)
        .concat(["button-menu-check", "undo"])
        .concat(this.mapNumberToActions(correctNumber))
        .concat(["button-menu-check", "button-menu-next"]);
    }
  }
}
</script>

<style scoped>
.input {
  min-height: 5em;
}
</style>
