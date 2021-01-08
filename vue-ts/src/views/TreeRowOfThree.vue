<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Die Biber haben jeweils 3 Bäume in einer Reihe gepflanzt. In jeder Reihe
      ist ein Baum der Höhe 1 (<img
        :src="require('@/assets/trees/tree_1_3.png')"
        style="height: 1em"
      />), ein Baum der Höhe 2 (<img
        :src="require('@/assets/trees/tree_2_3.png')"
        style="height: 1em"
      />) und ein Baum der Höhe 3 (<img
        :src="require('@/assets/trees/tree_3_3.png')"
        style="height: 1em"
      />). Wenn man die Baumreihe von der Seite anschaut, sieht man nur die
      Bäume, die nicht hinter grösseren Bäumen versteckt sind.
      <img
        :src="require('@/assets/trees/view_explanation_3.png')"
        style="max-width: 100%; margin: 1em"
      />
      Biber Alfons sieht nur zwei Bäume (von der Höhe 1 und 3) und Biberin Maria
      sieht auch nur zwei Bäume (von der Höhe 2 und 3).
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

@Component({
  components: {
    Game,
  },
})
export default class TreeRowOfThree extends Vue {
  type: GameType = GameType.TREEROW;
  title = views.find((el) => el.component === "TreeRowOfThree").title;
  args = { size: 3 };
  video = "placeholder.mp4";
}
</script>
