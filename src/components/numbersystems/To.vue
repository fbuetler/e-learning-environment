<template>
  <div @dragend.prevent="selected = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <Difficulty
      v-if="isDecimal"
      :selected="currentDifficultyLevel"
      :difficultyLevels="difficultyLevels"
      @difficulty-selected="currentDifficultyLevel = $event"
    />
    <div class="number">
      Zahle mit
      <b v-if="currentDifficultyLevel === 2">möglichst wenig </b>
      <span v-if="isBinary">binären </span>
      Münzen die folgende Summe:
    </div>
    <div id="number" class="big-text">{{ number }}</div>
    <ItemDropzone
      :items="selectedItems"
      :itemConfig="items(type)"
      @dropped="addItem()"
    />
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
import Undo from "@/components/shared/Undo.vue";
import Difficulty from "@/components/shared/Difficulty.vue";
import ItemSelection from "@/components/shared/ItemSelection.vue";
import ItemDropzone from "@/components/numbersystems/ItemDropzone.vue";

@Component<To>({
  components: {
    Undo,
    Difficulty,
    ItemSelection,
    ItemDropzone,
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

  isInitialized(): boolean {
    return this.number !== null;
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
    if (this.isBinary && this.selectedItems.some((el) => el > 1)) {
      return false;
    }
    const isCorrectSum =
      this.sumItems(this.type, this.selectedItems) === this.number;
    if (this.currentDifficultyLevel === 2 && this.isDecimal && isCorrectSum) {
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

  get isBinary(): boolean {
    return this.type === numbersystemType.BINARY;
  }

  get isDecimal(): boolean {
    return this.type === numbersystemType.DECIMAL;
  }
}
</script>

<style scoped>
.number {
  margin: 1em;
}
</style>
