<template>
  <div class="treerow">
    <h1>Reihe aus 3 Bäumen</h1>
    <div class="buttons-container">
      <button class="button" v-on:click="initializeGame()">
        {{ initializeGameText }}
      </button>
      <button class="button" v-on:click="evaluateGame()" v-if="isGameStarted">
        {{ evaluateGameText }}
      </button>
    </div>
    <div class="grid" v-if="isGameStarted">
      <div class="grid-cell">{{ treeRow.question.leftView }}</div>
      <div
        v-for="cell in treeRow.answer"
        v-bind:key="cell.value"
        class="grid-cell"
      >
        <input v-model="cell.value" type="text" class="grid-cell-content" />
        {{ cell.value }}
      </div>
      <div class="grid-cell">{{ treeRow.question.rightView }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class RowOfTree extends Vue {
  private treeRow: {
    id: number;
    question: {
      leftView: number;
      rightView: number;
    };
    answer: {
      value: number;
    }[];
    solution: {
      value: number;
    }[];
  };
  private possibleTreeRows = [
    {
      id: 1,
      question: {
        leftView: 3,
        rightView: 1,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 1,
        },
        {
          value: 2,
        },
        {
          value: 3,
        },
      ],
    },
    {
      id: 2,
      question: {
        leftView: 1,
        rightView: 3,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 3,
        },
        {
          value: 2,
        },
        {
          value: 1,
        },
      ],
    },
    {
      id: 3,
      question: {
        leftView: 2,
        rightView: 2,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 1,
        },
        {
          value: 3,
        },
        {
          value: 2,
        },
      ],
    },
    {
      id: 4,
      question: {
        leftView: 2,
        rightView: 2,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 2,
        },
        {
          value: 3,
        },
        {
          value: 1,
        },
      ],
    },
    {
      id: 5,
      question: {
        leftView: 2,
        rightView: 1,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 2,
        },
        {
          value: 1,
        },
        {
          value: 3,
        },
      ],
    },
    {
      id: 6,
      question: {
        leftView: 1,
        rightView: 2,
      },
      answer: [
        {
          value: 0,
        },
        {
          value: 0,
        },
        {
          value: 0,
        },
      ],
      solution: [
        {
          value: 3,
        },
        {
          value: 1,
        },
        {
          value: 2,
        },
      ],
    },
  ];
  private initializeGameText = "Start!";
  private evaluateGameText = "Verify!";
  private isGameStarted = false;
  public initializeGame(): void {
    this.treeRow = this.possibleTreeRows[
      Math.floor(Math.random() * this.possibleTreeRows.length)
    ];
    this.initializeGameText = "Restart";
    this.isGameStarted = true;
  }
  public evaluateGame(): void {
    console.log(this.treeRow);
    return;
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
