<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

@Component<MayasTo>({
  components: {
    Game,
  },
})
export default class MayasTo extends Vue {
  private type: GameType = GameType.MAYASTO;
  private title = "Zahlen wie die Mayas darstellen";
}
</script>
