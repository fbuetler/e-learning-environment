<template>
  <Game :type="type" :title="title">
    <p slot="description">
      Biberin Anita findet auf einem Stück Rinde einen Geheimtext und Biberin
      Ada zeigt ihr ein anderes Stück Rinde und meint darauf ist "das Geheimnis
      der Geheimschrift". Der Text wurde chiffriert, indem die Buchstaben nach
      einem bestimmten Muster ausgetauscht wurden. Schaffst du es, den
      Geheimtext zu lesen?
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

@Component<PatternDecryption>({
  components: {
    Game,
  },
})
export default class PatternDecryption extends Vue {
  type: GameType = GameType.PATTERNDECRYPTION;
  title = views.find((el) => el.component === GameType.PATTERNDECRYPTION).title;
  video = "placeholder.mp4";
}
</script>
