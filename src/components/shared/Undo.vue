<template>
  <div
    id="undo"
    class="flex-item flex-center card clickable responsive"
    title="Neu starten!"
    @click="$emit('undo-operation', $event)"
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
.card > img {
  margin: 1em;
}
</style>
