<template>
  <div class="cards">
    <div class="card" v-for="item in items" :key="item.id">
      <router-link :to="item.link">
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
import { symbolDecryptionTitle } from "./SymbolDecryption.vue";
import { symbolEncryptionTitle } from "./SymbolEncryption.vue";
import { patternDecryptionTitle } from "./PatternDecryption.vue";
import { patternEncryptionTitle } from "./PatternEncryption.vue";

@Component<Home>({})
export default class Home extends Vue {
  private items: Array<{
    id: number;
    title: string;
    link: string;
    img: string;
  }> = [
    {
      id: 1,
      title: "Ähnliche Wörter (hinzufügen)",
      link: "/wordsadd",
      img: "placeholder.jpg",
    },
    {
      id: 2,
      title: "Ähnliche Wörter (ändern)",
      link: "/wordschange",
      img: "placeholder.jpg",
    },
    {
      id: 3,
      title: "Ähnliche Wörter (entfernen)",
      link: "/wordsremove",
      img: "placeholder.jpg",
    },
    {
      id: 4,
      title: "Ähnliche Wörter (vertauschen)",
      link: "/wordsswap",
      img: "placeholder.jpg",
    },
    {
      id: 5,
      title: "Maya Zahlen darstellen",
      link: "/mayasto",
      img: "placeholder.jpg",
    },
    {
      id: 6,
      title: "Maya Zahlen verstehen",
      link: "/mayasfrom",
      img: "placeholder.jpg",
    },
    {
      id: 7,
      title: "Maya Zahlen addieren",
      link: "/mayasaddition",
      img: "placeholder.jpg",
    },
    {
      id: 12,
      title: symbolEncryptionTitle,
      link: "/symbolencryption",
      img: "placeholder.jpg",
    },
    {
      id: 13,
      title: symbolDecryptionTitle,
      link: "/symboldecryption",
      img: "placeholder.jpg",
    },
    {
      id: 14,
      title: patternEncryptionTitle,
      link: "/patternencryption",
      img: "placeholder.jpg",
    },
    {
      id: 15,
      title: patternDecryptionTitle,
      link: "/patterndecryption",
      img: "placeholder.jpg",
    },
    {
      id: 8,
      title: "Reihe aus 3 Bäumen",
      link: "/treerow3",
      img: "placeholder.jpg",
    },
    {
      id: 9,
      title: "3x3 Baumsudoku",
      link: "/treesudoku3",
      img: "placeholder.jpg",
    },
    {
      id: 10,
      title: "Reihe aus 4 Bäumen",
      link: "/treerow4",
      img: "placeholder.jpg",
    },
    {
      id: 11,
      title: "4x4 Baumsudoku",
      link: "/treesudoku4",
      img: "placeholder.jpg",
    },
  ];
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
