<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Versuche neue Wörter zu bilden, indem du einen Buchstaben austauschst.
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
import Game, { GameType } from "@/components/Game.vue";
import views from "@/views/Views";

@Component({
  components: {
    Game,
  },
})
export default class WordsChange extends Vue {
  type: GameType = GameType.WORDSCHANGE;
  title = views.find((el) => el.component === GameType.WORDSCHANGE).title;
  video = "placeholder.mp4";
}
</script>
