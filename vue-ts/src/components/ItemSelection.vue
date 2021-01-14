<template>
  <div class="flex-item flex-wrap flex-row">
    <div
      class="flex-item flex-wrap flex-center card clickable"
      v-for="item in items"
      :key="item.id"
      :class="[
        {
          selected: item.type === selected,
        },
        item.class,
      ]"
      @click="$emit('selected', item.type)"
      draggable
      @dragstart="$emit('selected', item.type)"
      @dragover.prevent
      @dragend.prevent
      @drop.prevent
    >
      <img :src="require('@/assets/' + item.img)" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export type item = {
  id: number;
  type: number;
  value: number;
  img: string;
  class: string;
};

@Component<ItemSelection>({})
export default class ItemSelection extends Vue {
  @Prop({ required: true })
  selected: number;
  @Prop({ required: true })
  items: item[];
}
</script>
