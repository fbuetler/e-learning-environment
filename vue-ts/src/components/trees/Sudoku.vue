<template>
  <div class="treesudoku">
    <h1>{{ size }}x{{ size }} Baumsudoku</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Sudoku extends Vue {
  @Prop({ required: true })
  private size: number;
}
</script>

<style scoped></style>
