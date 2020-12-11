<template>
  <header>
    <router-link to="/">
      <img :src="require('@/assets/beavers/beavers.png')" />
    </router-link>
  </header>
</template>

<script lang="ts">
export default {
  name: "Header",
};
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
