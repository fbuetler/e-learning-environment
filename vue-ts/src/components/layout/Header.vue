<template>
  <header>
    <h1>einfach INFORMATIK</h1>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/wordsadd">Ähnliche Wörter (hinzufügen)</router-link> |
      <router-link to="/wordschange">Ähnliche Wörter (ändern)</router-link> |
      <router-link to="/wordsremove">Ähnliche Wörter (entfernen)</router-link> |
      <router-link to="/wordsswap">Ähnliche Wörter (vertauschen)</router-link> |
      <router-link to="/treerow3">Reihe aus 3 Bäumen</router-link> |
      <router-link to="/treesudoku3">3x3 Baumsudoku</router-link> |
      <router-link to="/treerow4">Reihe aus 4 Bäumen</router-link> |
      <router-link to="/treesudoku4">4x4 Baumsudoku</router-link>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  name: "Header",
};
</script>

<style scoped>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #000000;
}
</style>
