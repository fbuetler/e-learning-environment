<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Die Biber pflanzen 16 Bäume in Felder der Grösse 4 x 4. Die Höhen der
      Bäume sind 1, 2, 3 und 4. In jeder Reihe (horizontal und vertikal) kommt
      jede Baumhöhe einmal vor. Die Zahlen rund um das Feld geben an, wie viele
      Bäume man sieht, wenn man die Baumreihe aus dieser Position anschaut.
      <img
        :src="require('@/assets/trees/sudoku_explanation_4.png')"
        class="center"
      />
      Auf den Feldern in dieser Aufgabe sind nur wenige Informationen vorhanden.
      Kannst du die Baumreihen trotzdem bilden? <br />
      Die Schwierigkeitsgrade unterscheiden sich indem auf "leicht" keine Zahlen
      rund um das Feld und die meisten Bäume im Feld sind bereits gesetzt, auf
      "mittelschwer" und "schwer" werden einige Zahlen rund um das Feld und
      einige Bäume im Feld angezeigt, wobei die Anzahl Bäume im Feld auf
      "schwer" verringert ist.
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
export default class TreeSudokuOfFour extends Vue {
  type: GameType = GameType.TREESUDOKU;
  size = 4;
  title = views.find((el) => el.component === "TreeSudokuOfFour").title;
  args = { size: this.size };
  video = "treesudoku4.mp4";
}
</script>

<style scoped>
.center {
  display: block;
  width: 50%;
  max-height: 300px;
  margin: 1em auto;
}
</style>
