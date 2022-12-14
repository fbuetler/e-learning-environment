<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Stelle die gleiche Summe mit weniger Münzen dar</div>
    <ItemGroup :items="generatedItems" :itemConfig="items(type)" />
    <hr />
    <div>Lösung:</div>
    <ItemDropzone
      :items="selectedItems"
      :itemConfig="items(type)"
        :itemName="'Münzen'"
      @dropped="addItem()"
    />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch flex-wrap"
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
import ItemGroup from "@/components/numbersystems/ItemGroup.vue";

@Component<Swap>({
  components: {
    Undo,
    Difficulty,
    ItemSelection,
    ItemDropzone,
    ItemGroup,
  },
})
export default class Swap extends Mixins(GameMixin, NumbersystemsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { numbersystemType: numbersystemType };
  type = this.args.numbersystemType;

  selected: number = null;
  selectedItems: Array<number> = null;
  generatedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isInitialized(): boolean {
    return this.generatedItems !== null;
  }

  start() {
    this.selected = null;
    this.selectedItems = new Array<number>(this.items(this.type).length).fill(
      0
    );
    do {
      this.generatedItems = this.generateItems(this.type);
    } while (
      this.sumItems(this.type, this.generatedItems) >= this.limit(this.type) ||
      this.countItems(this.generatedItems) ===
        this.countItems(
          this.calcMinimalAmount(
            this.type,
            this.sumItems(this.type, this.generatedItems)
          )
        )
    );
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return (
      this.sumItems(this.type, this.selectedItems) ===
        this.sumItems(this.type, this.generatedItems) &&
      this.countItems(this.selectedItems) < this.countItems(this.generatedItems)
    );
  }

  countItems(arr: number[]): number {
    return arr.reduce((sum, el) => (sum += el));
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
    const correctSum = this.sumItems(this.type, this.generatedItems);
    const wrongSum = Math.ceil(Math.random() * this.limit(this.type));

    return this.mapNumberToActions(wrongSum, this.type)
      .concat(["button-menu-check", "undo"])
      .concat(this.mapNumberToActions(correctSum, this.type))
      .concat(["button-menu-check", "button-menu-next"]);
  }
}
</script>

<style scoped></style>
