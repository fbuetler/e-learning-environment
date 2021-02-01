<template>
  <header>
    <router-link to="/">
      <img
        :src="require('@/assets/beavers/beavers.png')"
        title="Zurück zur Hauptseite"
      />
    </router-link>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component<Header>({})
export default class Header extends Vue {}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
img {
  max-width: 50%;
}
</style>
