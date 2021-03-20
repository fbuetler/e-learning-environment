<template>
  <div>
    <div>
      <h2>EINFACH INFORMATIK 3/4</h2>
      <h3>Rätsel und Spiele mit symbolischen Informationsdarstellungen</h3>
    </div>
    <div class="cards">
      <div v-for="item in items" :key="item.id" class="card clickable">
        <router-link :to="item.path">
          <div class="card-image flex-item flex-center responsive">
            <img :src="require('@/assets/' + item.img)" />
          </div>
          <div class="card-container">
            {{ item.title }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import views from "@/views/Views";

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
  grid-gap: 1em;
}
.card-image {
  height: 8em;
}
.card-image > img {
  border-radius: 5px 5px 0 0;
}
.card-container {
  margin-top: 6px;
  padding: 2px 16px;
}
/* router-link */
a {
  text-decoration: none;
  color: black;
}
</style>
