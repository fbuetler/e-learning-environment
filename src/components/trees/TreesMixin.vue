<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { item } from "@/components/shared/ItemSelection.vue";

@Component
export default class TreesMixin extends Vue {
  shuffle(arr: number[] | [number, number][]): void {
    let currentIndex = arr.length;
    let tempValue: number | [number, number];
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = tempValue;
    }
  }

  getVisibleTrees(values: number[]): number {
    let min = 0;
    let visible = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] > min) {
        visible++;
        min = values[i];
      }
    }
    return visible;
  }

  items(size: number): item[] {
    const items = new Array<item>();
    for (let i = 1; i <= size; i++) {
      items.push({
        id: i,
        type: i,
        value: i,
        max: 0,
        img: `trees/tree_${i}_${size}.png`,
        class: "",
      });
    }
    return items;
  }
}
</script>
