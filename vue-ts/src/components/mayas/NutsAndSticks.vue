<template>
  <div class="flex-container">
    <div
      class="flex-item"
      v-for="item in items"
      :key="item.id"
      :class="{ selected: item.id === selected }"
      @click="$emit('selected', item.id)"
      draggable
      @dragstart="$emit('selected', item.id)"
      @dragover.prevent
      @dragend.prevent
      @drop.prevent
    >
      <img :src="require('@/assets/' + item.path)" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<NutsAndSticks>({})
export default class NutsAndSticks extends Vue {
  @Prop({ type: Number, required: true })
  private selected: number;

  private items: { id: number; path: string }[] = [
    {
      id: 1,
      path: "mayas/nut.png",
    },
    {
      id: 2,
      path: "mayas/stick.png",
    },
  ];
}
</script>

<style scoped></style>
