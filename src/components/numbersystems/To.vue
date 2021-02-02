<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      v-if="displayDifficulty"
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="currentDifficultyLevel = $event"
    />
    <div class="number">
      Stell die folgende Summe
      <b v-if="currentDifficultyLevel === 2">mit möglichst wenig Münzen</b> dar:
    </div>
    <div id="number" class="big-text">{{ number }}</div>
    <div
      id="dropzone"
      class="flex-item flex-center flex-col flex-flex dropzone"
      @click="addItem()"
      @dragover.prevent
      @dragend.prevent
      @drop.stop.prevent="addItem()"
    >
      <div v-if="nothingSelected">
        Platziere hier die Münzen
      </div>
      <div v-else>
        <slot>
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
        </slot>
      </div>
    </div>
    <hr />
    <div
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
  numbersystemType,
} from "@/components/numbersystems/NumbersystemsMixin.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import Difficulty from "@/components/Difficulty.vue";

@Component<To>({
  components: {
    ItemSelection,
    Undo,
    Difficulty,
  },
})
export default class To extends Mixins(GameMixin, NumbersystemsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { numbersystemType: numbersystemType };
  type = this.args.numbersystemType;

  selected: number = null;
  number: number = null;
  selectedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  // there are only difficulty levels for numbersystemType.DECIMAL:
  // represent number with minimal amount of items
  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isStarted(): boolean {
    return this.number === null;
  }

  start() {
    this.number = Math.ceil(this.randomNumber(this.limit(this.type)));
    this.selected = null;
    this.selectedItems = new Array<number>(this.items(this.type).length).fill(
      0
    );
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    if (
      this.type === numbersystemType.BINARY &&
      this.selectedItems.some((el) => el > 1)
    ) {
      return false;
    }
    const isCorrectSum =
      this.sumItems(this.type, this.selectedItems) === this.number;
    if (
      this.currentDifficultyLevel === 2 &&
      this.type === numbersystemType.DECIMAL &&
      isCorrectSum
    ) {
      return (
        JSON.stringify(this.selectedItems) ===
        JSON.stringify(this.calcMinimalAmount(this.type, this.number))
      );
    }
    return isCorrectSum;
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
    const correctNumber = this.number;
    const wrongNumber = Math.ceil(this.randomNumber(this.limit(this.type)));

    return this.mapNumberToActions(wrongNumber, this.type)
      .concat(["button-menu-check", "undo"])
      .concat(this.mapNumberToActions(correctNumber, this.type))
      .concat(["button-menu-check", "button-menu-next"]);
  }

  get nothingSelected(): boolean {
    return this.selectedItems.every((el) => el === 0);
  }

  get displayDifficulty(): boolean {
    return this.type === numbersystemType.DECIMAL;
  }
}
</script>

<style scoped>
.number {
  margin: 1em;
}
.dropzone {
  min-height: 5em;
}
</style>
