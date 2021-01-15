<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Welche Zahl wird hier dargestellt?</div>
    <div class="flex-item flex-center flex-col flex-flex card">
      <slot>
        <div class="flex-item flex-center flex-row">
          <div
            class="flex-item flex-center flex-col"
            v-for="(amount, i) in generatedItems"
            :key="`item-${i}`"
          >
            <div
              :class="items(coinType)[i].class"
              v-for="j in amount"
              :key="`amount-${j}`"
            >
              <img :src="require(`@/assets/${items(coinType)[i].img}`)" />
            </div>
          </div>
        </div>
      </slot>
    </div>
    <hr />
    <div>Lösung:</div>
    <input
      id="answer-input"
      class="card big-text"
      size="5"
      v-model.number="number"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import CoinsMixin, { coinType } from "@/components/coins/CoinsMixin.vue";

@Component<From>({})
export default class From extends Mixins(GameMixin, CoinsMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { coinType: coinType };

  coinType = this.args.coinType;

  number: number = null;
  solution: number = null;
  generatedItems: Array<number> = null;
  animationSteps: Array<string> = null;

  isStarted(): boolean {
    return this.generatedItems === null;
  }

  restartGame() {
    this.number = null;
    this.generatedItems = this.generateItems(this.coinType);
    this.solution = this.sumItems(this.coinType, this.generatedItems);
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    return this.number === this.solution;
  }

  getAnimationSteps(): Array<string> {
    return [
      `answer-input:${Math.ceil(Math.random() * this.limit)}`,
      "button-menu-check",
      `answer-input:${this.solution}`,
      "button-menu-check",
      "button-menu-next",
    ];
  }
}
</script>
