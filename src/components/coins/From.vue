<template>
  <div>
    <slot name="animation" :animationSteps="animationSteps" />
    <div>Welche Summe wird hier dargestellt?</div>
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
              :class="items(coinType)[i].class"
            >
              <img :src="require(`@/assets/${items(coinType)[i].img}`)" />
            </div>
          </div>
        </div>
      </slot>
    </div>
    <hr />
    <div>Lösung:</div>
    <div id="answer">
      <input
        id="answer-input"
        v-model.number="number"
        class="card big-text"
        size="5"
        type="number"
      />
    </div>
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
