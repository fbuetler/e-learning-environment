<template>
  <div @dragend.prevent="selected = null">
    <div class="number">Stell die folgende Zahl dar:</div>
    <div class="big-text">{{ number }}</div>
    <div
      class="flex-item flex-center flex-col flex-flex dropzone"
      @click="addItem()"
      @dragover.prevent
      @dragend.prevent
      @drop.stop.prevent="addItem()"
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
      <ItemSelection
        :selected="selected"
        :items="items"
        @selected="selected = $event"
      />
      <Undo @undo-operation="undo()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins";
import MayasMixin, { itemType } from "@/components/mayas/Mayas";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";

@Component<To>({
  components: {
    ItemSelection,
    Undo,
  },
})
export default class To extends Mixins(GameMixin, MayasMixin)
  implements GameInterface {
  number: number = null;
  selected: itemType = null;
  selectedItems: Array<itemType> = null;

  limit = 19;

  isStarted(): boolean {
    return this.number === null;
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
    let sum = 0;
    for (let i = 0; i < this.items.length; i++) {
      sum += this.selectedItems[i] * this.items[i].value;
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
