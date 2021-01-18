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
    <div class="big-text">{{ number }}</div>
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
                :class="items(type).reverse()[i].class"
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
import CoinsMixin, { coinType } from "@/components/coins/CoinsMixin.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import Difficulty from "@/components/Difficulty.vue";

// TODO remove hack introduced in: reverse coin order (hack) - 2610ec49b17304ceade048cb94cacac793945b0a

@Component<To>({
  components: {
    ItemSelection,
    Undo,
    Difficulty,
  },
})
export default class To extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { coinType: coinType };

  type = this.args.coinType;

  selected: number = null;
  number: number = null;
  selectedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  // there are only difficulty levels for coinType.NORMAL:
  // represent number with minimal amount of coints
  currentDifficultyLevel = 1;
  difficultyLevels = 2;

  isStarted(): boolean {
    return this.number === null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
    this.selected = null;
    this.selectedItems = new Array<number>(this.items(this.type).length).fill(
      0
    );
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    if (
      this.type === coinType.BINARY &&
      this.selectedItems.some((el) => el > 1)
    ) {
      return false;
    }
    const sum = this.sumItems(this.type, this.selectedItems);
    if (this.currentDifficultyLevel === 2 && this.type === coinType.NORMAL) {
      return (
        sum === this.number &&
        JSON.stringify(this.selectedItems) ===
          JSON.stringify(this.calcMinimalAmount(this.number, this.type))
      );
    }
    return sum === this.number;
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
    const wrongNumber = Math.ceil(Math.random() * this.limit);

    return this.mapNumberToActions(wrongNumber, this.type)
      .concat(["button-menu-check", "undo"])
      .concat(this.mapNumberToActions(correctNumber, this.type))
      .concat(["button-menu-check", "button-menu-next"]);
  }

  get nothingSelected(): boolean {
    return this.selectedItems.every((el) => el === 0);
  }

  get displayDifficulty(): boolean {
    return this.type === coinType.NORMAL;
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
