<template>
  <div
    id="trashcan"
    class="flex-item flex-center dropzone responsive"
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
.dropzone > img {
  margin: 1em;
}
</style>
