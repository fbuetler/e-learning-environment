<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component({
  components: {
    Game,
  },
})
export default class WordsSwap extends Vue {
  private type: GameType = GameType.WORDSSWAP;
  title = views.find((el) => el.component === GameType.WORDSSWAP).title;
}
</script>
