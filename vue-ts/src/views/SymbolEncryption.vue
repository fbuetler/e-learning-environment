<template>
  <Game :type="type" :title="title" :video="video" :description="description" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

export const symbolEncryptionTitle = "Sätze mit Zeichen chiffrieren";

@Component<SymbolEncryption>({
  components: {
    Game,
  },
})
export default class SymbolEncryption extends Vue {
  type: GameType = GameType.SYMBOLENCRYPTION;
  title = views.find((el) => el.component === GameType.SYMBOLENCRYPTION).title;
  video = "placeholder.mp4";
  description = "intentionally empty";
}
</script>
