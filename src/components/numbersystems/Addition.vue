<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="
        currentDifficultyLevel = $event;
        start();
      "
    />
    <div>Was ist die Summe der Zahlen, die hier zusammen addiert werden?</div>
    <div id="addition" class="flex-item flex-wrap flex-center flex-row">
      <div
        v-for="(summand, index) in summands"
        id="summands"
        :key="index"
        class="flex-item flex-wrap flex-center flex-row flex-flex"
      >
        <div id="items" class="flex-item flex-center flex-row card">
          <div
            v-for="(amount, i) in summand"
            :key="`summand-${index}-item-${i}`"
            class="flex-item flex-center flex-col"
          >
            <div
              v-for="j in amount"
              :key="`amount-${j}`"
              :class="items(type)[i].class"
            >
              <img :src="require(`@/assets/${items(type)[i].img}`)" />
            </div>
          </div>
        </div>
        <div v-if="!(index === summands.length - 1)">+</div>
        <div v-else>=</div>
      </div>
      <div v-if="currentDifficultyLevel === 1">
        <input
          id="answer-input"
          v-model.number="sum"
          class="card big-text"
          size="5"
          type="number"
        />
      </div>
      <div
        v-else
        id="dropzone"
        class="flex-item flex-center flex-col flex-flex dropzone"
        @click="addItem()"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="addItem()"
      >
        <div v-if="nothingSelected">
          Platziere hier die Elemente
        </div>
        <div v-else>
          <div class="flex-item flex-center flex-row">
            <div
              v-for="(amount, i) in selectedItems"
              :key="`item-${i}`"
              class="flex-item flex-center flex-col"
            >
              <div
                v-for="j in amount"
                :key="`amount-${j}`"
                :class="items(type)[i].class"
              >
                <img :src="require(`@/assets/${items(type)[i].img}`)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div
      v-if="currentDifficultyLevel === 2"
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="selected"
        :items="items(type)"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import NumbersystemsMixin, {
  maya,
  numbersystemType,
} from "@/components/numbersystems/NumbersystemsMixin.vue";
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
export default class Addition extends Mixins(GameMixin, NumbersystemsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { numbersystemType: numbersystemType };
  type = this.args.numbersystemType;

  sum: number = null;
  solution: number = null;
  summands: Array<Array<maya>> = null; // unfortunately Maps and Sets are not reactive in vue 2
  selected: maya = null;
  selectedItems: Array<maya> = null;
  animationSteps: Array<string> = null;

  numberOfSummands = 2;

  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isInitialized(): boolean {
    return this.summands !== null;
  }

  start() {
    this.selected = null;
    this.sum = null;
    this.summands = new Array(this.numberOfSummands);
    let sum: number;
    do {
      sum = 0;
      for (let i = 0; i < this.summands.length; i++) {
        const summand = this.generateItems(numbersystemType.MAYA);
        this.summands[i] = summand;
        sum += this.sumItems(numbersystemType.MAYA, summand);
      }
    } while (sum > this.limit(this.type));
    this.solution = sum;
    // level 2
    this.selectedItems = new Array<number>(Object.keys(maya).length / 2).fill(
      0
    );
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    if (this.currentDifficultyLevel === 1) {
      return this.sum === this.solution;
    } else {
      if (this.selectedItems[maya.ONE] > 4) {
        return false;
      }
      return (
        this.sumItems(numbersystemType.MAYA, this.selectedItems) ===
        this.solution
      );
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
    const wrongNumber = Math.ceil(Math.random() * this.limit(this.type));

    if (this.currentDifficultyLevel === 1) {
      return [
        `answer-input:${wrongNumber}`,
        "button-menu-check",
        `answer-input:${correctNumber}`,
        "button-menu-check",
        "button-menu-next",
      ];
    } else {
      return this.mapNumberToActions(numbersystemType.MAYA, wrongNumber)
        .concat(["button-menu-check", "undo"])
        .concat(this.mapNumberToActions(numbersystemType.MAYA, correctNumber))
        .concat(["button-menu-check", "button-menu-next"]);
    }
  }

  get nothingSelected(): boolean {
    return this.selectedItems.every((el) => el === 0);
  }
}
</script>

<style scoped>
.dropzone {
  min-height: 5em;
}
</style>
