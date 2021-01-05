<template>
  <Game :type="type" :title="title">
    <p slot="description">
      Versuche neue Wörter zu bilden, indem du zwei Buchstaben vertauschst.
    </p>
    <video loop controls muted slot="video">
      <source :src="require('@/assets/tutorials/' + video)" />
      Your browser does not support the video tag.
    </video>
  </Game>
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
  type: GameType = GameType.WORDSSWAP;
  title = views.find((el) => el.component === GameType.WORDSSWAP).title;
  video = "placeholder.mp4";
}
</script>
