<template>
  <div class="treesudoku">
    <SudokuOfFourfrom />
  </div>
</template>

<script lang="ts">
import SudokuOfFourfrom from "@/components/trees/SudokuOfFour.vue";

export default {
  name: "treesudokuoffour",
  components: {
    SudokuOfFourfrom,
  },
};
</script>

<style scoped></style>
