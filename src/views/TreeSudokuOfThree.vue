<template>
  <Game :type="type" :args="args">
    <h2 slot="title">{{ title }}</h2>
    <p slot="description">
      Die Biber pflanzen ein 3 x 3‐Feld mit insgesamt 9 Bäumen. Die Bäume haben
      3 unterschiedliche Höhen: 1, 2 und 3. In jeder horizontalen Reihe (Zeile)
      und in jeder vertikalen Reihe (Spalte) des Feldes gibt es von jeder
      Baumhöhe einen Baum. Die Zahlen rund um das Feld zeigen an, wie viele
      Bäume jemand sieht, wenn er oder sie die Baumreihe aus dieser Position
      heraus anschaut.
      <img
        :src="require('@/assets/trees/sudoku_explanation_3.png')"
        class="center"
      />
      Auf den Feldern in dieser Aufgabe sind nur wenige Informationen vorhanden.
      Kannst du die Baumreihen trotzdem bilden?<br />
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
export default class TreeSudokuOfThree extends Vue {
  type: GameType = GameType.TREESUDOKU;
  size = 3;
  title = views.find((el) => el.component === "TreeSudokuOfThree").title;
  args = { size: this.size };
  video = "treesudoku3.mp4";
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
