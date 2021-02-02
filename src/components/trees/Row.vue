<template>
  <div @dragend="itemToAdd = null">
    <slot name="animation" :animationSteps="animationSteps" />
    <div>
      Versuch das Baumreihenrätsel zu lösen.
    </div>
    <div id="row" class="flex-item flex-center">
      <table>
        <tbody>
          <tr>
            <!-- left view -->
            <td id="left-view" class="card tree-view ">
              {{ leftView }}
            </td>
            <!-- values -->
            <td
              v-for="field in values"
              :id="`field-${field.id}`"
              :key="`field-${field.id}`"
              class="dropzone tree-field"
              @click="moveTree($event, field.id)"
              draggable
              @dragstart="moveTree($event, field.id)"
              @dragover.prevent
              @dragend.prevent
              @drop.stop.prevent="moveTree($event, field.id)"
            >
              <img
                v-if="field.value !== 0"
                :src="
                  require('@/assets/trees/tree_' +
                    field.value +
                    '_' +
                    size +
                    '.png')
                "
              />
            </td>
            <!-- right view -->
            <td id="right-view" class="card tree-view ">
              {{ rightView }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="interaction-container flex-item flex-row flex-center flex-stretch"
    >
      <ItemSelection
        :selected="itemToAdd"
        :items="items(size)"
        @selected="itemToAdd = $event"
      />
      <Trashcan @trashed-element="trashElement($event)" />
      <Undo @undo-operation="undo()" />
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
  valuesSolution: row = null;

  itemToAdd = null;
  fieldToClean = null;
  animationSteps: Array<string> = null;

  isInitialized(): boolean {
    return (
      this.values !== null && this.leftView !== null && this.rightView !== null
    );
  }

  start(): void {
    [
      this.leftView,
      this.rightView,
      this.values,
      this.valuesSolution,
    ] = this.generate();
    this.itemToAdd = null;
    this.fieldToClean = null;
    this.animationSteps = this.getAnimationSteps();
  }

  isCorrect(): boolean {
    const row = this.values.map((field) => field.value);
    const visibleLeft = this.getVisibleTrees(row);
    const visibleRight = this.getVisibleTrees(row.slice().reverse());
    return !(visibleLeft !== this.leftView || visibleRight !== this.rightView);
  }

  generate(): [number, number, row, row] {
    const values = Array.from({ length: this.size }, (_, i) => i + 1);
    this.shuffle(values);
    const row = Array.from({ length: this.size }, (el, i) =>
      this.createRowField(i, 0, false)
    );
    return [
      this.getVisibleTrees(values),
      this.getVisibleTrees(values.slice().reverse()),
      row,
      values.map((el, i) => this.createRowField(i, el, false)),
    ];
  }

  createRowField(index: number, value: number, locked: boolean): rowField {
    return {
      id: index,
      value: value,
      locked: locked,
    };
  }

  moveTree(event: Event, fieldID: number) {
    const field = this.values.find((el) => el.id === fieldID);
    if (field.locked) {
      return;
    }
    if (field.value === 0) {
      // empty field -> set tree
      let oldFieldID: number;
      if (
        event instanceof DragEvent &&
        event.dataTransfer.getData("id") !== ""
      ) {
        oldFieldID = +event.dataTransfer.getData("id");
      } else if (this.fieldToClean !== null) {
        oldFieldID = this.fieldToClean;
        this.fieldToClean = null;
      } else {
        oldFieldID = null;
      }
      if (oldFieldID !== null) {
        const oldField = this.values.find((el) => el.id === oldFieldID);
        if (oldField.locked) {
          return;
        }
        this.itemToAdd = oldField.value;
        Vue.set(oldField, "value", 0);
      }
      if (this.itemToAdd === null) {
        return;
      }
      Vue.set(field, "value", this.itemToAdd);
      this.itemToAdd = null;
    } else {
      // occupied field -> move/remove tree
      if (event instanceof DragEvent && event.type === "dragstart") {
        event.dataTransfer.setData("id", fieldID.toString());
      }
      this.fieldToClean = fieldID;
    }
  }

  trashElement(event: Event) {
    let fieldID: number;
    if (event instanceof DragEvent && event.dataTransfer.getData("id") !== "") {
      fieldID = +event.dataTransfer.getData("id");
    } else if (this.fieldToClean !== null) {
      fieldID = this.fieldToClean;
      this.fieldToClean = null;
    } else {
      return;
    }
    const field = this.values.find((el) => el.id === fieldID);
    if (field.locked) {
      return;
    }
    Vue.set(field, "value", 0);
  }

  undo() {
    this.values.forEach((el) => {
      el.value = 0;
    });
    this.itemToAdd = null;
    this.fieldToClean = null;
  }

  getAnimationSteps(): Array<string> {
    const correctOrder = this.valuesSolution.map((el) => el.value);
    let wrongOrder: number[];
    do {
      wrongOrder = correctOrder.slice();
      this.shuffle(wrongOrder);
    } while (
      this.getVisibleTrees(wrongOrder) === this.leftView &&
      this.getVisibleTrees(wrongOrder.slice().reverse()) === this.rightView
    );

    return wrongOrder
      .flatMap((el, i) => [`item-selection-${el}`, `field-${i}`])
      .concat(["button-menu-check", "undo"])
      .concat(
        correctOrder.flatMap((el, i) => [`item-selection-${el}`, `field-${i}`])
      )
      .concat(["button-menu-check", "button-menu-next"]);
  }
}
</script>
