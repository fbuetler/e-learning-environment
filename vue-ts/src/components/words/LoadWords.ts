import words from "@/assets/words/words.json";

export type wordElement = {
  id: number;
  char: string;
  initialChar: string;
  locked: boolean;
};

export function LoadWords(key: string): [wordElement[], string[]] {
  const allWords = words;
  const keys = Object.keys(allWords[key]);
  const chosenWord = keys[Math.floor(Math.random() * keys.length)];
  const wordParts = chosenWord.split("");

  const similarWords = allWords[key][chosenWord];
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
