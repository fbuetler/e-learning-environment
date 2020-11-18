<template>
  <div class="treerow">
    <h1>Reihe aus {{ size }} Bäumen</h1>
    <div class="buttons-container">
      <button class="button" v-on:click="initializeGame()">
        {{ initializeGameText }}
      </button>
      <button class="button" v-on:click="evaluateGame()" v-if="isGameStarted">
        {{ evaluateGameText }}
      </button>
    </div>
    <div class="grid" v-if="isGameStarted && !showResult">
      <div class="grid-cell">{{ leftView }}</div>
      <div v-for="cell in answer" v-bind:key="cell.id" class="grid-cell">
        <input
          v-model.number="cell.value"
          type="text"
          class="grid-cell-content"
        />
      </div>
      <div class="grid-cell">{{ rightView }}</div>
    </div>
    <div v-if="showResult" class="solution">
      <h2>{{ resultMessage }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

type Answer = {
  id: number;
  value: number;
}[];

@Component
export default class RowOfTree extends Vue {
  @Prop({ required: true })
  private size: number;
  private answer: Answer;
  @Prop()
  private leftView!: number;
  @Prop()
  private rightView!: number;
  private initializeGameText = "Start!";
  private evaluateGameText = "Verify!";
  private isGameStarted = false;
  private showResult = false;
  private resultMessage: string;

  public initializeGame(): void {
    [this.leftView, this.rightView, this.answer] = this.generateTreeRow();
    this.initializeGameText = "Restart";
    this.isGameStarted = true;
  }

  public evaluateGame(): void {
    if (this.answer.length != this.size) {
      this.resultMessage = "Ungültige Antwort!";
    } else {
      const trArr = this.answer.map((tree) => tree.value);
      const visibleLeft = this.visibleTreesFromLeft(trArr);
      const visibleRight = this.visibleTreesFromLeft(trArr.slice().reverse());
      if (visibleLeft !== this.leftView || visibleRight !== this.rightView) {
        this.resultMessage = "Falsch!";
      } else {
        this.resultMessage = "Richtig!";
      }
    }
    this.showResult = true;
    this.isGameStarted = false;
    setTimeout(() => {
      this.showResult = false;
      this.isGameStarted = true;
    }, 2000);
  }

  private generateTreeRow(): [number, number, Answer] {
    const numbers: number[] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = i + 1;
    }
    this.shuffle(numbers);
    const answer: Answer = [];
    for (let i = 0; i < this.size; i++) {
      answer[i] = {
        id: i + 1,
        value: 0,
      };
    }
    return [
      this.visibleTreesFromLeft(numbers),
      this.visibleTreesFromLeft(numbers.slice().reverse()),
      answer,
    ];
  }

  private shuffle(arr: number[]): void {
    let currentIndex = arr.length;
    let tempValue: number;
    let randomIndex: number;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      tempValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = tempValue;
    }
  }

  private visibleTreesFromLeft(trees: number[]): number {
    let min = 0;
    let visible = 0;
    for (const tree of trees) {
      if (tree > min) {
        visible++;
        min = tree;
      }
    }
    return visible;
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

.treerow {
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

.grid-cell {
  display: table-cell;
  padding: 10px;
  border: 1px solid gray;
}

.grid-cell-editor {
  border: none;
  width: 20px;
  height: 20px;
  font-family: "Dosis", sans-serif;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  transition: all ease 1s;
}
</style>
