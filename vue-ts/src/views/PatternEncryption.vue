<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Du möchtest nun deine eigene Nachricht chiffrieren. Schaffst du es die
      Nachricht mit Hilfe des Musters korrekt zu verschlüsseln?
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

@Component<PatternEncryption>({
  components: {
    Game,
  },
})
export default class PatternEncryption extends Vue {
  type: GameType = GameType.PATTERNENCRYPTION;
  title = views.find((el) => el.component === GameType.PATTERNENCRYPTION).title;
  video = "placeholder.mp4";
}
</script>
