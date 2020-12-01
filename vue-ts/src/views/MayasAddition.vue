<template>
  <Game :type="type" :title="title" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";

@Component<MayasAddition>({
  components: {
    Game,
  },
})
export default class MayasAddition extends Vue {
  private type: GameType = GameType.MAYASADDITION;
  private title = "Zahlen der Mayas addieren";
}
</script>
