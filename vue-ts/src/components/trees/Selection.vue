<template>
  <div class="container">
    <div
      class="container-item"
      v-for="index in size"
      :key="index"
      :class="{ selected: index === selected }"
      @click="changeSelection(index)"
    >
      <img :src="require('@/assets/trees/tree_' + index + '.png')" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop} from "vue-property-decorator";

@Component
export default class Selection extends Vue {
  @Prop({ type: Number, required: true })
  private size!: number;
  @Prop({ type: Number, required: true })
  private selected: number;

  private changeSelection(selected: number) {
    this.$emit("changeSelection", selected);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  background: white;
  border: 3px solid black;
}
.container-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
}
.container-item.selected {
  background: #eeee4e;
}
</style>
