<template>
  <div>{{ text }} {{ initialize }} {{ evaluate }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component<Testgame>({
  watch: {
    initialize(newValue: boolean) {
      if (newValue) {
        this.initializeGame();
        this.$emit("initialized-game");
      }
    },
    evaluate(newValue: boolean) {
      if (newValue) {
        const correct = this.evaluateGame();
        this.$emit("evaluated-game", correct);
      }
    },
  },
})
export default class Testgame extends Vue {
  private text = "test";
  @Prop()
  private initialize: boolean;
  @Prop()
  private evaluate: boolean;
  @Prop()
  private args: any;

  created() {
    this.initializeGame();
    this.$emit("initialized-game");
  }

  public initializeGame(): void {
    this.text = "init";
  }

  public evaluateGame(): boolean {
    this.text = "eval";
    return true;
  }
}
</script>
