<template>
  <Game :type="type" :title="title" :args="args" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "@/components/Game.vue";

@Component({
  components: {
    Game,
  },
})
export default class TreeRowOfThree extends Vue {
  private type: GameType = GameType.TREEROW;
  private size = 4;
  private title = "Reihe aus " + this.size + " Bäumen";
  private args = { size: this.size };
}
</script>
