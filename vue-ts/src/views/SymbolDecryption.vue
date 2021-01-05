<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Die Bieber verwenden eine geheimnisvolle Tabelle, um Ziffern und
      Buchstaben mit ganz neuen Symbolen zu kodieren. Kannst du den Geheimtext
      lesen?
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

@Component<SymbolDecryption>({
  components: {
    Game,
  },
})
export default class SymbolDecryption extends Vue {
  type: GameType = GameType.SYMBOLDECRYPTION;
  title = views.find((el) => el.component === GameType.SYMBOLDECRYPTION).title;
  video = "placeholder.mp4";
}
</script>
