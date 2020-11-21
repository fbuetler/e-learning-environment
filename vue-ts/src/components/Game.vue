<template>
  <div>
    <h2>{{ title }}</h2>
    <Buttonmenu
      :initializeGameText="initializeGameText"
      :evaluateGameText="evaluateGameText"
      :isGameStarted="isGameStarted"
      @initialize-game="initializeGame()"
      @evalute-game="evaluateGame()"
    />
    <div v-if="isGameStarted && !showResult">
      <component
        :is="currentGameComponent"
        :args="args"
        :initialize="initGame"
        :evaluate="evalGame"
        @initialized-game="initializedGame()"
        @evaluated-game="(correct) => evaluatedGame(correct)"
      ></component>
    </div>
    <div v-if="showResult">
      <h3>{{ resultText }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Buttonmenu from "@/components/Buttonmenu.vue";
import Testgame from "@/components/Testgame.vue";
import Row from "@/components/trees/Row.vue";
import Sudoku from "@/components/trees/Sudoku.vue";

export enum GameType {
  TREEROW = "Row",
  TREESUDOKU = "Sudoku",
  TESTGAME = "Testgame",
}

@Component({
  components: {
    Buttonmenu,
    Testgame,
    Row,
    Sudoku,
  },
})
export default class Game extends Vue {
  @Prop({ required: true })
  private type: GameType;
  @Prop()
  private title: string;
  @Prop({ default: {} })
  private args: any;

  private initializeGameText = "Start!";
  private evaluateGameText = "Überprüfen!";
  private resultText = "";
  private isGameStarted = false;
  private showResult = false;

  private initGame = false;
  private evalGame = false;

  public initializeGame(): void {
    this.initializeGameText = "Neu starten";
    this.isGameStarted = true;
    this.resultText = "";
    this.initGame = true;
  }

  private initializedGame(): void {
    this.initGame = false;
  }

  public evaluateGame(): void {
    this.evalGame = true;
  }

  private evaluatedGame(correct: boolean): void {
    if (correct) {
      this.resultText = "Richtig!";
    } else {
      this.resultText = "Falsch!";
    }
    this.showResult = true;
    this.isGameStarted = false;
    this.evalGame = false;
    setTimeout(() => {
      this.showResult = false;
      this.isGameStarted = true;
    }, 2000);
  }

  get currentGameComponent() {
    return this.type;
  }
}
</script>
