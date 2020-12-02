<template>
  <div>
    <div class="input-container" @click="addItem()">
      <div>
        <div class="nuts">
          <div class="nut" v-for="index in items[nut]" :key="index">
            <img :src="require('@/assets/mayas/nut.png')" />
          </div>
        </div>
        <div class="sticks">
          <div class="stick" v-for="index in items[stick]" :key="index">
            <img :src="require('@/assets/mayas/stick.png')" />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <input v-model.number="number" type="number" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import { itemType } from "./NutsAndSticks.vue";

@Component<From>({})
export default class From extends Mixins(GameMixin) implements GameInterface {
  private number: number = null;
  private items: Array<itemType> = null;

  private maxItems = 4;

  isStarted(): boolean {
    return this.items === null;
  }

  restartGame() {
    this.items = new Array<number>(Object.keys(itemType).length / 2);
    for (let i = 0; i < this.items.length; i++) {
      this.items[i] = Math.ceil(Math.random() * this.maxItems);
    }
  }

  isCorrect(): boolean {
    return (
      this.number === this.items[itemType.NUT] + this.items[itemType.STICK] * 5
    );
  }

  get nut(): number {
    return itemType.NUT;
  }

  get stick(): number {
    return itemType.STICK;
  }
}
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
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
