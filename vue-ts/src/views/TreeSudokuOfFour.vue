<template>
  <div class="treesudoku">
    <SudokuOfThree />
  </div>
</template>

<script lang="ts">
import SudokuOfThree from "@/components/trees/SudokuOfThree.vue";

export default {
  name: "treesudokuoffour",
  components: {
    SudokuOfThree,
  },
};
</script>

<style scoped></style>
