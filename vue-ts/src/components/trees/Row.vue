<template>
  <div @dragend="selected = null">
    <div>
      Versuch das Baumreihenrätsel zu lösen.
    </div>
    <div class="flex-item flex-center flex-row flex-stretch flex-flex">
      <div class="flex-item flex-center card">{{ leftView }}</div>
      <div
        class="flex-item flex-center dropzone tree-dropzone"
        v-for="field in values"
        :key="field.id"
        @click="putTree($event, field.id)"
        draggable
        @dragstart="startDrag($event, field.id)"
        @dragover.prevent
        @dragend.prevent
        @drop.stop.prevent="putTree($event, field.id)"
      >
        <img
          v-if="field.value !== 0"
          :src="
            require('@/assets/trees/tree_' + field.value + '_' + size + '.png')
          "
        />
      </div>
      <div class="flex-item flex-center card">{{ rightView }}</div>
    </div>
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="selected"
        :items="items(size)"
        @selected="selected = $event"
      />
      <Trashcan @trashed-element="(event) => trashElement(event)" />
      <Undo @undo-operation="undo($event)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import GameMixin, { GameInterface } from "@/components/GameMixins.vue";
import TreesMixin from "@/components/trees/TreesMixin.vue";
import ItemSelection from "@/components/ItemSelection.vue";
import Undo from "@/components/Undo.vue";
import Trashcan from "@/components/Trashcan.vue";

type rowField = {
  id: number;
  value: number;
  initialValue: number;
  locked: boolean;
};
type row = rowField[];

@Component<Row>({
  components: {
    ItemSelection,
    Trashcan,
    Undo,
  },
})
export default class Row extends Mixins(GameMixin, TreesMixin)
  implements GameInterface {
  @Prop({ required: true })
  args!: { size: number };

  size: number = this.args.size;

  values: row = null;
  leftView: number = null;
  rightView: number = null;

  selected = null;

  isStarted(): boolean {
    return (
      this.values === null || this.leftView === null || this.rightView === null
    );
  }

  restartGame(): void {
    [this.leftView, this.rightView, this.values] = this.generate();
  }

  isCorrect(): boolean {
    const row = this.values.map((field) => field.value);
    const visibleLeft = this.getVisibleTrees(row);
    const visibleRight = this.getVisibleTrees(row.slice().reverse());
    return !(visibleLeft !== this.leftView || visibleRight !== this.rightView);
  }

  putTree(event: Event, id: number): void {
    const field = this.values.find((el) => el.id == id);
    if (field.locked) {
      return;
    }
    if (event instanceof DragEvent && event.dataTransfer.getData("id") !== "") {
      const oldID = +event.dataTransfer.getData("id");
      const oldField = this.values.find((el) => el.id === oldID);
      if (oldField.locked) {
        return;
      }
      this.selected = oldField.value;
      Vue.set(oldField, "value", 0);
    }
    if (this.selected === null) {
      return;
    }
    Vue.set(field, "value", this.selected);
    this.selected = null;
  }

  generate(): [number, number, row] {
    const values: number[] = [];
    for (let i = 0; i < this.size; i++) {
      values[i] = i + 1;
    }
    this.shuffle(values);
    const row = new Array<rowField>(this.size);
    for (let i = 0; i < row.length; i++) {
      row[i] = this.createRowField(i, 0, false);
    }
    return [
      this.getVisibleTrees(values),
      this.getVisibleTrees(values.slice().reverse()),
      row,
    ];
  }

  createRowField(index: number, value: number, locked: boolean): rowField {
    return {
      id: index,
      value: value,
      initialValue: value,
      locked: locked,
    };
  }

  startDrag(event: DragEvent, id: number) {
    event.dataTransfer.setData("id", id.toString());
  }

  trashElement(event: Event) {
    if (
      !(event instanceof DragEvent) ||
      event.dataTransfer.getData("id") === ""
    ) {
      return;
    }
    const id = +event.dataTransfer.getData("id");
    if (this.values.find((el) => el.id === id).locked) {
      return;
    }
    Vue.set(this.values[id], "value", 0);
  }

  undo() {
    this.values.forEach((el) => {
      el.value = el.initialValue;
    });
  }
}
</script>
