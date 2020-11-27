import words from "@/assets/words/words.json";

export function LoadWords(key: string): [any[], string[]] {
  const allWords = words;
  const keys = Object.keys(allWords[key]);
  const chosenWord = keys[Math.floor(Math.random() * keys.length)];
  const wordParts = chosenWord.split("");

  const similarWords = allWords[key][chosenWord];
  const word = new Array<any>();
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
