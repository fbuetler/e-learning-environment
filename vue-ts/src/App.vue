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
hr {
  border: 1px solid black;
}
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  width: 80%;
  margin: 0 auto;
}
.card {
  border-radius: 5px;
  background: white;
  border: 3px solid #e7e7e7;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 0.5rem;
  margin: 1em;
}
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.card > img {
  border-radius: 5px 5px 0 0;
}
.flex-item {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-center {
  align-items: center;
  justify-content: center;
}
.flex-stretch {
  align-items: stretch;
}
.flex-row {
  flex-direction: row;
}
.flex-col {
  flex-direction: column;
}
.flex-flex {
  flex: 1;
}
</style>
