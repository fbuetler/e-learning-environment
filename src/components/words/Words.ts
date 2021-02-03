import words from "@/assets/words/words.json";
import { item } from "@/components/shared/ItemSelection.vue";

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

function findFirstDiffPos(a: string, b: string): [number, string] {
  let i = 0;
  while (a[i] === b[i]) {
    i++;
  }
  return [i, b[i]];
}

export function findCorrectAndWrongSolutions(
  word: string,
  similarWord: string
): [number, string, number, string] {
  const [correctPos, correctChar] = findFirstDiffPos(word, similarWord);
  let wrongChar: string;
  let wrongPos: number;
  do {
    wrongChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  } while (wrongChar === correctChar);
  do {
    wrongPos = Math.floor(Math.random() * word.length + 1);
  } while (wrongPos === correctPos);
  return [correctPos, correctChar, wrongPos, wrongChar];
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
    max: 0,
    img: el,
    class: "word-char",
  };
});
