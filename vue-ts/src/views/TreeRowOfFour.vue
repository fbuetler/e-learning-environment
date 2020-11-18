<template>
  <div class="treerow">
    <Row :size="4" />
  </div>
</template>

<script lang="ts">
import Row from "@/components/trees/Row.vue";

export default {
  name: "TreeRowOfFour",
  components: {
    Row,
  },
};
</script>

<style scoped></style>
