<template>
  <div class="treesudoku">
    <Sudoku size="4" />
  </div>
</template>

<script lang="ts">
import Sudoku from "@/components/trees/Sudoku.vue";

export default {
  name: "TreeSudokuOfFour",
  components: {
    Sudoku,
  },
};
</script>

<style scoped></style>
