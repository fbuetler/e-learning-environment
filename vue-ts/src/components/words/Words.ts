import words from "@/assets/words/words.json";
import { item } from "@/components/ItemSelection.vue";

export type wordElement = {
  id: number;
  char: string;
  initialChar: string;
  locked: boolean;
};

export function LoadWords(
  key: string,
  distance: number
): [wordElement[], string[]] {
  const allWords = words;
  const keys = Object.keys(allWords[key][distance]);
  const chosenWord = keys[Math.floor(Math.random() * keys.length)];
  const wordParts = chosenWord.split("");

  const similarWords = allWords[key][distance][chosenWord];
  const word = new Array<wordElement>();
  for (let i = 0; i < wordParts.length; i++) {
    word.push({
      id: i,
      char: wordParts[i],
      initialChar: wordParts[i],
      locked: false,
    });
  }
  return [word, similarWords];
}

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const items: item[] = alphabet.map((el, i) => {
  return {
    id: i,
    type: i,
    value: i,
    img: el,
    class: "word-char",
  };
});
