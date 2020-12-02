<template>
  <div class="flex-container">
    <div
      class="flex-item"
      v-for="item in items"
      :key="item.id"
      :class="{ selected: item.type === selected }"
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
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

export enum itemType {
  NUT = 0,
  STICK = 1,
}

@Component<NutsAndSticks>({})
export default class NutsAndSticks extends Vue {
  @Prop({ required: true })
  private selected: itemType;

  private items: { id: number; type: itemType; img: string }[] = [
    {
      id: 1,
      type: itemType.NUT,
      img: "mayas/nut.png",
    },
    {
      id: 2,
      type: itemType.STICK,
      img: "mayas/stick.png",
    },
  ];
}
</script>
