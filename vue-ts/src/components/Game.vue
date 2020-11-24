<template>
  <div>
    <h2>{{ title }}</h2>
    <Buttonmenu
      :restartGameText="restartGameText"
      :evaluateGameText="evaluateGameText"
    />
    <keep-alive :max="1">
      <component
        v-if="!showResult"
        :is="currentGameComponent"
        :args="args"
        @evaluated-game="(correct) => evaluatedGame(correct)"
      ></component>
    </keep-alive>
    <div v-if="showResult">
      <h3>{{ resultText }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Buttonmenu from "@/components/Buttonmenu.vue";
import Row from "@/components/trees/Row.vue";
import Sudoku from "@/components/trees/Sudoku.vue";
import { EventBus, EventBusEvents } from "./EventBus";

export enum GameType {
  TREEROW = "Row",
  TREESUDOKU = "Sudoku",
}

@Component({
  components: {
    Buttonmenu,
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
  private args: {};

  private restartGameText = "Neu starten!";
  private evaluateGameText = "Überprüfen!";
  private resultText = "";
  private showResult = false;

  private evaluatedGame(correct: boolean): void {
    if (correct) {
      this.resultText = "Richtig!";
    } else {
      this.resultText = "Falsch!";
    }
    this.showResult = true;
    setTimeout(() => {
      this.showResult = false;
      this.resultText = "";
    }, 2000);
  }

  get currentGameComponent() {
    return this.type;
  }
}
</script>
