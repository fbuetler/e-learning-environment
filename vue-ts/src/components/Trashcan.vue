<template>
  <div
    class="trashcan"
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
.trashcan {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed black;
  margin: 0em 1em 0em 1em;
}
.trashcan > img {
  width: 100%;
  max-width: 80px;
  margin: 1em;
}
</style>
