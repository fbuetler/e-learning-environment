<template>
  <div
    id="undo"
    class="undo flex-item flex-center card"
    @click="$emit('undo-operation', $event)"
    title="Neu starten!"
  >
    <img :src="require('@/assets/icons/undo.png')" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component<Undo>({})
export default class Undo extends Vue {}
</script>

<style scoped>
.undo > img {
  width: 100%;
  max-width: 80px;
  margin: 1em;
}
</style>
