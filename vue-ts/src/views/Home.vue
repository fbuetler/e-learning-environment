<template>
  <div class="cards">
    <div class="card" v-for="item in items" :key="item.id">
      <router-link :to="item.path">
        <img :src="require('@/assets/' + item.img)" style="width:100%" />
        <div class="container">
          {{ item.title }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import views from "./Views";

@Component<Home>({})
export default class Home extends Vue {
  get items() {
    return views;
  }
}
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 1rem;
}
.container {
  padding: 2px 16px;
}
/* router-link */
a {
  text-decoration: none;
  color: black;
}
</style>
