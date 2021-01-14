import { Vue, Component } from "vue-property-decorator";

export enum normalCoins {
  ONE,
  TWO,
  FIFE,
  TEN,
  TWENTY,
  FIFTY,
}

export enum binaryCoins {
  ONE,
  TWO,
  FOUR,
  EIGHT,
  SIXTEEN,
  THIRTYTWO,
  SIXTYFOUR,
}

@Component
export default class CoinsMixin extends Vue {}
