<template>
  <div>
    <div>Welche Zahl wird hier dargestellt?</div>
    <div class="flex-item flex-center flex-col flex-flex card">
      <div>
        <div class="flex-item flex-center flex-row">
          <div class="nut" v-for="index in items[nut]" :key="index">
            <img :src="require('@/assets/mayas/nut.png')" />
          </div>
        </div>
        <div class="flex-item flex-center flex-col">
          <div class="stick" v-for="index in items[stick]" :key="index">
            <img :src="require('@/assets/mayas/stick.png')" />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div>Lösung:</div>
    <input
      class="card big-text"
      size="5"
      v-model.number="number"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins";
import MayasMixin from "@/components/mayas/Mayas";

@Component<From>({})
export default class From extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  number: number = null;
  items: Array<number> = null; // unfortunately Maps and Sets are not reactive in vue 2

  isStarted(): boolean {
    return this.items === null;
  }

  restartGame() {
    this.items = this.generateItems();
  }

  isCorrect(): boolean {
    return this.number === this.sumItems(this.items);
  }
}
</script>
