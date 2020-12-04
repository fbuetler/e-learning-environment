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
export default class WordsChange extends Vue {
  private type: GameType = GameType.WORDSCHANGE;
  title = views.find((el) => el.component === this.constructor.name).title;
}
</script>
