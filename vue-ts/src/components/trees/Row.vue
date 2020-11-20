<template>
  <div>
    <h2>Reihe aus {{ size }} Bäumen</h2>
    <div class="buttons-container">
      <button @click="initializeGame()">
        {{ initializeGameText }}
      </button>
      <button @click="evaluateGame()" v-if="isGameStarted">
        {{ evaluateGameText }}
      </button>
    </div>
    <div v-if="isGameStarted && !showResult">
      <div class="grid" :style="cellsPerRowWithViews">
        <div>{{ leftView }}</div>
        <div v-for="cell in answer" :key="cell.id" @click="putTree(cell.id)">
          <img
            v-if="cell.value === 0"
            :src="require('@/assets/trees/tree_empty.png')"
          />
          <img
            v-else
            :src="require('@/assets/trees/tree_' + cell.value + '.png')"
          />
        </div>
        <div>{{ rightView }}</div>
      </div>
      <Selection
        :size="size"
        :selected="pickedTree"
        @changeSelection="pickedTree = $event"
      />
        </div>
    <div v-if="showResult">
      <h3>{{ resultText }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Selection from "@/components/trees/Selection.vue";

type Answer = {
  id: number;
  value: number;
}[];

@Component({
  components: {
    Selection,
  },
})
export default class Row extends Vue {
  @Prop({ type: Number, required: true })
  private size!: number;
  private answer: Answer = null;
  private leftView: number = null;
  private rightView: number = null;

  private initializeGameText = "Start!";
  private evaluateGameText = "Überprüfen!";
  private resultText = "";
  private isGameStarted = false;
  private showResult = false;
  private pickedTree = 0;

  public initializeGame(): void {
    [this.leftView, this.rightView, this.answer] = this.generateTreeRow();
    this.initializeGameText = "Neu starten";
    this.isGameStarted = true;
    this.resultText = "";
  }

  public evaluateGame(): void {
    if (this.answer.length != this.size) {
      this.resultText = "Ungültige Antwort!";
    } else {
      const trArr = this.answer.map((tree) => tree.value);
      const visibleLeft = this.visibleTreesFromLeft(trArr);
      const visibleRight = this.visibleTreesFromLeft(trArr.slice().reverse());
      if (visibleLeft !== this.leftView || visibleRight !== this.rightView) {
        this.resultText = "Falsch!";
      } else {
        this.resultText = "Richtig!";
      }
    }
    this.showResult = true;
    this.isGameStarted = false;
    setTimeout(() => {
      this.showResult = false;
      this.isGameStarted = true;
    }, 2000);
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

  get cellsPerRowWithViews(): string {
    return "grid-template-columns: repeat(" + (this.size + 2) + ",auto)";
  }
  get cellsPerRow(): string {
    return "grid-template-columns: repeat(" + this.size + ",auto)";
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

.buttons-container {
  display: grid;
  grid-template-rows: auto auto;
  justify-content: center;
}
button {
  border-radius: 6px;
  background-color: whitesmoke;
  border: none;
  color: black;
  font-size: 16px;
  padding: 10px;
  width: 230px;
  cursor: pointer;
  margin: 0px 0px 25px 0px;
  font-weight: bold;
}

.grid {
  display: grid;
  background: white;
  border: 3px solid black;
  margin: 0px 0px 25px 0px;
}
.grid > div {
  padding: 1rem;
  position: relative;
  border: 1px solid gray;
}
.grid > div::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.grid > div img {
  position: absolute;
  max-width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
