<template>
  <Game :type="type" :title="title" :args="args" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Game, { GameType } from "../components/Game.vue";
import views from "./Views";

@Component({
  components: {
    Game,
  },
})
export default class TreeRowOfFour extends Vue {
  private type: GameType = GameType.TREEROW;
  private size = 4;
  title = views.find((el) => el.component === "TreeRowOfFour").title;
  private args = { size: this.size };
}
</script>
