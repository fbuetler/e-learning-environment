import Vue from "vue";

export enum EventBusEvents {
  Restart = "restart-game",
  EvaluateGame = "eval-game",
}

export const EventBus = new Vue();
