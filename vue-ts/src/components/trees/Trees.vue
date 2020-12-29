<template>
  <div class="flex-item flex-wrap flex-row">
    <div
      class="flex-item flex-wrap flex-center card"
      :class="{ selected: index === selected }"
      v-for="index in size"
      :key="index"
      @click="$emit('tree-selected', index)"
      draggable
      @dragstart="$emit('tree-selected', index)"
      @dragover.prevent
      @dragend.prevent
      @drop.prevent
    >
      <img
        :src="require('@/assets/trees/tree_' + index + '_' + size + '.png')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class Selection extends Vue {
  @Prop({ type: Number, required: true })
  private size!: number;
  @Prop({ required: true })
  private selected: number;
}
</script>

<style scoped>
.card {
  align-items: flex-end;
}
</style>
