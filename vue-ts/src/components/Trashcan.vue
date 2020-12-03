<template>
  <div
    class="trashcan card"
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
}
.trashcan > img {
  width: 100%;
  max-width: 80px;
  margin: 1em;
}
</style>
