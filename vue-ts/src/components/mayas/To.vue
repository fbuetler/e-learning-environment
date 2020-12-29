<template>
  <div @dragend.prevent="selected = null">
    <div class="number">Stell die folgende Zahl dar: {{ number }}</div>
    <div
      class="flex-item flex-center flex-col flex-flex dropzone"
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
import MayasMixin, { itemType } from "./Mayas";
import NutsAndSticks from "@/components/mayas/NutsAndSticks.vue";
import Undo from "@/components/Undo.vue";

@Component<To>({
  components: {
    NutsAndSticks,
    Undo,
  },
})
export default class To extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  private number: number = null;
  private selected: itemType = null;
  private selectedItems: Array<itemType> = null;

  private limit = 19;

  isStarted(): boolean {
    return this.number == null;
  }

  restartGame() {
    this.number = Math.ceil(Math.random() * this.limit);
    this.selected = null;
    this.selectedItems = new Array<number>(
      Object.keys(itemType).length / 2
    ).fill(0);
  }

  isCorrect(): boolean {
    if (this.selectedItems[itemType.NUT] > 4) {
      return false;
    }
    return (
      this.selectedItems[itemType.NUT] +
        this.selectedItems[itemType.STICK] * 5 ===
      this.number
    );
  }

  addItem() {
    console.log("add item");
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
