<template>
  <div class="treerow">
    <Row :size="3" />
  </div>
</template>

<script lang="ts">
import Row from "@/components/trees/Row.vue";

export default {
  name: "TreeRowOfThree",
  components: {
    Row,
  },
};
</script>

<style scoped></style>
