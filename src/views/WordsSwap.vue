<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Versuche ein sinnvolles Wort zu bilden, indem du zwei Buchstaben
      vertauschst. Für den Schwierigkeitsgrad "leicht" muss nur ein
      Buchstabenpaar vertauscht werden. Für den Schwierigkeitsgrad
      "mittelschwer" sind zwei Tausche notwendig.
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
export default class WordsSwap extends Vue {
  type: GameType = GameType.WORDSSWAP;
  title = views.find((el) => el.component === GameType.WORDSSWAP).title;
  video = "wordsswap.mp4";
}
</script>
