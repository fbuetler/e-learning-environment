<template>
  <div class="sudoku">
    <h2>{{ size }}x{{ size }} Baumsudoku</h2>
    <div class="buttons-container">
      <button class="button" v-on:click="initializeGame()">
        {{ initializeGameText }}
      </button>
      <button class="button" v-on:click="evaluateGame()" v-if="isGameStarted">
        {{ evaluateGameText }}
      </button>
    </div>
    <div class="grid" v-if="isGameStarted && !showResult">
      <div class="grid-row" v-for="row in sudoku" v-bind:key="row.id">
        <div class="grid-cell" v-for="cell in row" v-bind:key="cell.id">
          <input
            v-model.number="cell.value"
            type="text"
            class="grid-cell-content"
          />
        </div>
      </div>
    </div>
    <div class="solution" v-if="showResult">
      <h3>{{ resultMessage }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop} from "vue-property-decorator";

@Component
export default class Sudoku extends Vue {
  @Prop({ required: true })
  private size: number;

  private initializeGameText = "Start!";
  private evaluateGameText = "Überprüfen!";
  private isGameStarted = false;
  private showResult = false;
  private resultMessage: string;

  public initializeGame(): void {
    this.initializeGameText = "Neu starten";
    this.isGameStarted = true;
    this.resultMessage = "";
  }

  public evaluateGame(): void {
    this.resultMessage = "TODO";

    this.showResult = true;
    this.isGameStarted = false;
    setTimeout(() => {
      this.showResult = false;
      this.isGameStarted = true;
    }, 2000);
  }
}
</script>
<style scoped>
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}

.sudoku {
  place-self: center;
  display: grid;
  grid-template-rows: auto 1fr;
  justify-items: center;
}
.buttons-container {
  display: grid;
  grid-template-rows: auto auto;
}
.button {
  display: inline-block;
  border-radius: 6px;
  background-color: whitesmoke;
  border: none;
  color: black;
  text-align: center;
  font-size: 16px;
  padding: 10px;
  width: 230px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 0px 0px 25px 0px;
  font-family: "Dosis", sans-serif;
  font-weight: bold;
}

.grid {
  display: table;
  background: white;
  border: 3px solid black;
}

/* .grid-row { } */

.grid-cell {
  display: table-cell;
  padding: 10px;
  border: 1px solid gray;
}

.grid-cell-editor {
  border: none;
  width: 20px;
  height: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
}
</style>
