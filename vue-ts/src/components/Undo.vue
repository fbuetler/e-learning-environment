<template>
  <div class="undo" @click="$emit('undo-operation', $event)">
    <img :src="require('@/assets/icons/undo.png')" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<Undo>({})
export default class Undo extends Vue {}
</script>

<style scoped>
.undo {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed black;
  margin: 1em;
}
.undo > img {
  width: 100%;
  max-width: 80px;
  margin: 1em;
}
</style>
