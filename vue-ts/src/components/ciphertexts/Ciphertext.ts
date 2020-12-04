// https://developer.mozilla.org/de/docs/Web/Guide/HTML/Canvas_Tutorial

import data from "@/assets/ciphertexts/ciphertexts.json";

export function LoadRandomElement(key: string): string {
  const elems = data[key];
  const elem = elems[Math.floor(Math.random() * elems.length)];
  console.log(elem);
  return elem;
}
