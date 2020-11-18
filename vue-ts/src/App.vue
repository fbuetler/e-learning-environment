<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

export default {
  name: "app",
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
body {
  background-color: #ff5252;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
}
</style>
