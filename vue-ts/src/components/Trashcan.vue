<template>
  <div
    id="trashcan"
    class="trashcan flex-item flex-center dropzone"
    title="Element entfernen!"
    @click="$emit('trashed-element', $event)"
    @dragover.prevent
    @dragenter.prevent
    @drop.stop.prevent="$emit('trashed-element', $event)"
  >
    <img :src="require('@/assets/icons/trashcan.png')" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component<Trashcan>({})
export default class Trashcan extends Vue {}
</script>

<style scoped>
.trashcan > img {
  width: 100%;
  max-width: 80px;
  margin: 1em;
}
</style>
