<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Stelle die gleiche Summe mit weniger Münzen dar</div>
    <div id="coins" class="flex-item flex-center flex-col flex-flex card">
      <slot>
        <div class="flex-item flex-center flex-row">
          <div
            v-for="(amount, i) in generatedItems"
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
    <hr />
    <div>Lösung:</div>
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
              v-for="(amount, i) in displaySelectedItems"
              :key="`item-${i}`"
              class="flex-item flex-center flex-col"
            >
              <div
                v-for="j in amount"
                :key="`amount-${j}`"
                :class="items(type).reverse()[i].class"
              >
                <img
                  :src="require(`@/assets/${items(type).reverse()[i].img}`)"
                />
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="selected"
        :items="items(type).reverse()"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import CoinsMixin, { coinType } from "@/components/coins/CoinsMixin.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import Difficulty from "@/components/Difficulty.vue";

// TODO: (optional) less coins or minimal number of coins? -> both: difficulties

@Component<Swap>({
  components: {
    ItemSelection,
    Undo,
    Difficulty,
  },
})
export default class Swap extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  type = coinType.NORMAL;

  selected: number = null;
  selectedItems: Array<number> = null;
  generatedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isStarted(): boolean {
    return this.generatedItems === null;
  }

  restartGame() {
    this.selected = null;
    this.selectedItems = new Array<number>(this.items(this.type).length).fill(
      0
    );
    do {
      this.generatedItems = this.generateItems(this.type);
    } while (
      this.countCoins(this.generatedItems) ===
      this.countCoins(
        this.calcMinimalAmount(
          this.sumItems(this.type, this.generatedItems),
          this.type
        )
      )
    );
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return (
      this.sumItems(this.type, this.selectedItems) ===
        this.sumItems(this.type, this.generatedItems) &&
      this.countCoins(this.selectedItems) < this.countCoins(this.generatedItems)
    );
  }

  countCoins(arr: number[]): number {
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
    const wrongSum = Math.ceil(Math.random() * this.limit);

    return this.mapNumberToActions(wrongSum, this.type)
      .concat(["button-menu-check", "undo"])
      .concat(this.mapNumberToActions(correctSum, this.type))
      .concat(["button-menu-check", "button-menu-next"]);
  }

  get nothingSelected(): boolean {
    return this.selectedItems.every((el) => el === 0);
  }

  get displaySelectedItems(): number[] {
    return this.selectedItems.slice().reverse();
  }
}
</script>

<style scoped>
.dropzone {
  min-height: 5em;
}
</style>
