import Vue from "vue";

export enum EventBusEvents {
  RestartGame = "restart-game",
  EvaluateGame = "eval-game",
  CloseModal = "close-modal",
}

export const EventBus = new Vue();
