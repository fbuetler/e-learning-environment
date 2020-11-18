<template>
  <div class="game">
    <h2>Reihe aus {{ size }} Bäumen</h2>
    <div class="buttons-container">
      <button class="button" @click="initializeGame()">
        {{ initializeGameText }}
      </button>
      <button class="button" @click="evaluateGame()" v-if="isGameStarted">
        {{ evaluateGameText }}
      </button>
    </div>
    <div class="content" v-if="isGameStarted && !showResult">
      <div class="grid">
        <div class="grid-cell">{{ leftView }}</div>
        <div
          class="tree"
          v-for="cell in answer"
          :key="cell.id"
          @click="putTree(cell.id)"
        >
          <img
            v-if="cell.value === 0"
            :src="require('@/assets/trees/tree_empty.png')"
          />
          <img
            v-else
            :src="require('@/assets/trees/tree_' + cell.value + '.png')"
          />
        </div>
        <div class="grid-cell">{{ rightView }}</div>
      </div>
      <div class="trees">
        <div
          class="tree"
          v-for="index in size"
          :key="index"
          :class="{ selected: index === pickedTree }"
          @click="pickTree(index)"
        >
          <img :src="require('@/assets/trees/tree_' + index + '.png')" />
        </div>
      </div>
    </div>
    <div v-if="showResult">
      <h3>{{ resultMessage }}</h3>
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
export default class Row extends Vue {
  @Prop({ type: Number, required: true })
  private size!: number;
  @Prop()
  private answer: Answer;
  @Prop()
  private leftView: number;
  @Prop()
  private rightView: number;

  private initializeGameText = "Start!";
  private evaluateGameText = "Überprüfen!";
  private isGameStarted = false;
  private showResult = false;
  private resultMessage = "";
  private pickedTree = 0;

  public initializeGame(): void {
    [this.leftView, this.rightView, this.answer] = this.generateTreeRow();
    this.initializeGameText = "Neu starten";
    this.isGameStarted = true;
    this.resultMessage = "";
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

  public pickTree(id: number): void {
    this.pickedTree = id;
  }

  public putTree(cellID: number): void {
    this.answer.find((el) => el.id === cellID).value = this.pickedTree;
    this.pickedTree = 0;
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

.game {
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
  cursor: pointer;
  margin: 0px 0px 25px 0px;
  font-weight: bold;
}

.content {
  display: grid;
}

.grid {
  display: table;
  background: white;
  margin: 0px 0px 25px 0px;
  border: 3px solid black;
}

.grid-cell {
  display: table-cell;
  padding: 10px;
  border: 1px solid gray;
}

.grid-cell-content {
  border: none;
  width: 20px;
  height: 20px;
  font-weight: bold;
  text-align: center;
  font-size: 18px;
}

.trees {
  display: table;
  background: white;
  margin: 0px 0px 25px 0px;
  border: 3px solid black;
  justify-items: center;
}

.tree {
  display: table-cell;
  padding: 10px;
  border: 1px solid gray;
}

.tree.selected {
  background: #eeee4e;
}

.tree img {
  width: 50px;
  height: 50px;
}
</style>
