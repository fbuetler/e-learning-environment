<template>
  <Game :type="type">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Die Biber verwenden eine geheimnisvolle Tabelle, um Ziffern und Buchstaben
      mit ganz neuen Symbolen zu kodieren. Kannst du den Bibern einen Geheimtext
      übermitteln, so dass sie die Nachricht entschlüsseln und verstehen können?
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

@Component<SymbolEncryption>({
  components: {
    Game,
  },
})
export default class SymbolEncryption extends Vue {
  type: GameType = GameType.SYMBOLENCRYPTION;
  title = views.find((el) => el.component === GameType.SYMBOLENCRYPTION).title;
  video = "symbolencryption.mp4";
}
</script>
