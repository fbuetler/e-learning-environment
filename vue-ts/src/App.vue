<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";

@Component<App>({
  components: {
    Header,
    Footer,
  },
})
export default class App extends Vue {}
</script>

<style>
body {
  background-color: #526cff;
}
hr {
  border: 1px solid black;
}
button {
  color: black;
  padding: 10px;
  width: 230px;
  font-weight: bold;
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
  transition: 0.3s;
  padding: 0.5em;
  margin: 1em;
}
.clickable:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.clickable:active {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  transform: scale(0.98);
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
.flex-center-horizontally {
  justify-content: center;
}
.flex-center-vertivally {
  align-items: center;
}
.flex-stretch {
  align-items: stretch;
}
.flex-space-between {
  justify-content: space-between;
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
.dropzone {
  border: 2px dashed #324197;
  background: #4658c2;
  border-radius: 5px;
  min-height: 1em;
  min-width: 1em;
  margin: 1em;
}
.equal-space {
  flex: 1 1 0px;
}
.big-text {
  font-size: 2em;
}
</style>
