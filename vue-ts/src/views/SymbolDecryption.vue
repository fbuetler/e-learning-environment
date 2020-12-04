<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component<SymbolDecryption>({
  components: {
    Game,
  },
})
export default class SymbolDecryption extends Vue {
  private type: GameType = GameType.SYMBOLDECRYPTION;
  title = views.find((el) => el.component === this.constructor.name).title;
}
</script>
