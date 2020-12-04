<template>
  <Game :type="type" :title="title" />
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
  private type: GameType = GameType.SYMBOLENCRYPTION;
  title = views.find((el) => el.component === this.constructor.name).title;
}
</script>
