<template>
  <Game
    :type="type"
    :title="title"
    :args="args"
    :video="video"
    :description="description"
  />
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
  type: GameType = GameType.TREEROW;
  size = 4;
  title = views.find((el) => el.component === "TreeRowOfFour").title;
  args = { size: this.size };
  video = "placeholder.mp4";
  description = `Die Biber pflanzen weitere Bäume in Reihen, diesmal jeweils 4 Laubbäume in 
  einer Reihe. In jeder Reihe befindet sich genau ein 
  Baum der Höhe 1 (<img src='${require("@/assets/trees/tree_1_4.png")}' style='height: 1em'/>),
  ein Baum der Höhe 2 (<img src='${require("@/assets/trees/tree_2_4.png")}' style='height: 1em'/>),
  ein Baum der Höhe 3 (<img src='${require("@/assets/trees/tree_3_4.png")}' style='height: 1em'/>) und
  ein Baum der Höhe 4 (<img src='${require("@/assets/trees/tree_4_4.png")}' style='height: 1em'/>).
  Wenn die Bäume von der Seite angeschaut werden, sind nur diejenigen Bäume zu sehen, die nicht 
  hinter grösseren versteckt sind. 
  <img src='${require("@/assets/trees/view_explanation_4.png")}' style='max-width: 100%; margin: 1em'/> 
  Biber Alfons sieht zwei Bäume (von der Höhe 2 und 4), Biberin Maria sieht drei 
  Bäume (von der Höhe 1, 3 und 4).`;
}
</script>
