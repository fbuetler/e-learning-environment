import Vue from "vue";

export enum EventBusEvents {
  RestartGame = "restart-game",
  EvaluateGame = "eval-game",
}

export const EventBus = new Vue();
