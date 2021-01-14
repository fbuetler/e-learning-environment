<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { EventBus, EventBusEvents } from "@/components/EventBus";

export interface GameInterface {
  isStarted(): boolean;
  restartGame(): void;
  isCorrect(): boolean;
}

@Component
export default class GameMixin extends Vue {
  private notOverwrittenMsg =
    "THIS SHOULD NOT BE EXECUTED! DID YOU FORGET TO OVERWRITE THIS FUNC?";
  created() {
    if (this.isStarted()) {
      this.restartGame();
    }
    EventBus.$on(EventBusEvents.RestartGame, () => this.restartGame());
    EventBus.$on(EventBusEvents.EvaluateGame, () => this.evaluateGame());
  }

  isStarted(): boolean {
    throw Error(this.notOverwrittenMsg);
  }

  restartGame() {
    throw Error(this.notOverwrittenMsg);
  }

  evaluateGame() {
    this.$emit("evaluated-game", this.isCorrect());
  }

  isCorrect(): boolean {
    throw Error(this.notOverwrittenMsg);
  }
}
</script>