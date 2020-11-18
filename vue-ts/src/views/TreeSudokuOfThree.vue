<template>
  <div class="treesudoku">
    <Sudoku size="3" />
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
