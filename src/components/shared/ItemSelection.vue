<template>
  <div
    id="item-selection"
    class="flex-item flex-wrap flex-center-horizontally flex-row"
  >
    <div
      v-for="item in items"
      :id="`item-selection-${item.id}`"
      :key="item.id"
      :class="[
        {
          selected: item.type === selected,
        },
        item.class,
      ]"
      class="flex-item flex-wrap flex-center card clickable responsive"
      @click="$emit('selected', item.type)"
      draggable
      @dragstart="$emit('selected', item.type)"
      @dragover.prevent
      @dragend.prevent
      @drop.prevent
    >
      <img v-if="isPath(item.img)" :src="require('@/assets/' + item.img)" />
      <div v-else>{{ item.img }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export type item = {
  id: number;
  type: number;
  value: number;
  max: number;
  img: string;
};

@Component<ItemSelection>({})
export default class ItemSelection extends Vue {
  @Prop({ required: true })
  selected: number;
  @Prop({ required: true })
  items: item[];

  isPath(path: string): boolean {
    return path.includes("/");
  }
}
</script>

<style scoped>
.flex-wrap {
  max-width: 80%;
}
</style>
