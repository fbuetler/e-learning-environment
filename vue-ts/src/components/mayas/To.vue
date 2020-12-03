<template>
  <div>
    <div class="number">Stell die folgende Zahl dar: {{ number }}</div>
    <div
      class="flex-item flex-center flex-col flex-flex dropzone input"
      @click="addItem()"
    >
      <div v-if="selectedItems[nut] === 0 && selectedItems[stick] === 0">
        Platziere hier die Nüsse und Stöcke
      </div>
      <div v-else>
        <div class="flex-item flex-center flex-row">
          <div class="nut" v-for="index in selectedItems[nut]" :key="index">
            <img :src="require('@/assets/mayas/nut.png')" />
          </div>
        </div>
        <div class="flex-item flex-center flex-col">
          <div class="stick" v-for="index in selectedItems[stick]" :key="index">
            <img :src="require('@/assets/mayas/stick.png')" />
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <NutsAndSticks :selected="selected" @selected="selected = $event" />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "../Game";
import { itemType } from "./Mayas";
import NutsAndSticks from "@/components/mayas/NutsAndSticks.vue";
import Undo from "@/components/Undo.vue";

@Component<To>({
  components: {
    NutsAndSticks,
    Undo,
  },
})
export default class To extends Mixins(GameMixin) implements GameInterface {
  private number: number = null;
  private selected: itemType = null;
  private selectedItems: Array<itemType> = null;

  private limit = 19;

  isStarted(): boolean {
    return this.number == null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
    this.selectedItems = new Array<number>(
      Object.keys(itemType).length / 2
    ).fill(0);
  }

  isCorrect(): boolean {
    return (
      this.selectedItems[itemType.NUT] +
        this.selectedItems[itemType.STICK] * 5 ===
      this.number
    );
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

  get nut(): number {
    return itemType.NUT;
  }

  get stick(): number {
    return itemType.STICK;
  }
}
</script>

<style scoped>
.number {
  margin: 1rem;
  font-size: 2em;
}
.input {
  min-height: 5rem;
}
</style>
