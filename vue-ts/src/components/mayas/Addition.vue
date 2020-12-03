<template>
  <div>
    <div class="addition-container">
      <div class="summands" v-for="(summand, index) in summands" :key="index">
        <div class="element-container">
          <div class="nuts">
            <div class="nut" v-for="nutIndex in summand[nut]" :key="nutIndex">
              <img :src="require('@/assets/mayas/nut.png')" />
            </div>
          </div>
          <div class="sticks">
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
      <div>
        <input v-model.number="sum" type="number" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import MayasMixin, { itemType } from "./Mayas";

@Component<Addition>({})
export default class Addition extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  sum: number = null;
  summands: Array<Array<itemType>> = null; // unfortunately Maps and Sets are not reactive in vue 2

  numberOfSummands = 2;

  isStarted(): boolean {
    return this.summands === null;
  }

  restartGame() {
    this.summands = new Array(this.numberOfSummands);
    for (let i = 0; i < this.summands.length; i++) {
      this.summands[i] = this.generateItems();
    }
  }

  isCorrect(): boolean {
    return (
      this.sum ===
      this.summands.reduce((sum, summand) => sum + this.sumItems(summand), 0)
    );
  }
}
</script>

<style scoped>
.addition-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.summands {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
}
.element-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 5rem;
  border: dashed 3px black;
  border-radius: 15px;
  background-color: lightsalmon;
}
.nuts {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.sticks {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
