<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "@/components/EventBus";

export interface GameInterface {
  isStarted(): boolean;
  start(): void;
  isCorrect(): boolean;
}

@Component
export default class GameMixin extends Vue {
  private notOverwrittenMsg =
    "THIS SHOULD NOT BE EXECUTED! DID YOU FORGET TO OVERWRITE THIS FUNC?";
  created() {
    if (this.isStarted()) {
      this.start();
    }
    EventBus.$on(EventBusEvents.Start, () => this.start());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluate());
  }

  isStarted(): boolean {
    throw Error(this.notOverwrittenMsg);
  }

  start() {
    throw Error(this.notOverwrittenMsg);
  }

  evaluate() {
    this.$emit("evaluated-game", this.isCorrect());
  }

  isCorrect(): boolean {
    throw Error(this.notOverwrittenMsg);
  }

  randomNumber(limit: number): number {
    return Math.random() * limit;
  }

  shake(id: string) {
    const el = document.getElementById(id);
    el.style.animation = "shake 0.5s";
    setTimeout(() => {
      el.style.animation = "unset";
    }, 500);
  }
}
</script>
