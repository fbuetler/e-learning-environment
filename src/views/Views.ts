const views: Array<{
  id: number;
  path: string;
  title: string;
  img: string;
  view: string;
  component: string;
}> = [
  {
    id: 1,
    title: "Ähnliche Wörter - Buchstabe hinzufügen",
    path: "/words/add",
    img: "words/beaver_add.png",
    view: "WordsAdd",
    component: "WordsAdd",
  },
  {
    id: 2,
    title: "Ähnliche Wörter - Buchstabe austauschen",
    path: "/words/change",
    img: "words/beaver_change.png",
    view: "WordsChange",
    component: "WordsChange",
  },
  {
    id: 3,
    title: "Ähnliche Wörter - Buchstabe entfernen",
    path: "/words/remove",
    img: "words/beaver_remove.png",
    view: "WordsRemove",
    component: "WordsRemove",
  },
  {
    id: 4,
    title: "Ähnliche Wörter - Buchstaben vertauschen",
    path: "/words/swap",
    img: "words/beaver_swap.png",
    view: "WordsSwap",
    component: "WordsSwap",
  },
  {
    id: 5,
    title: "Maya Zahlen darstellen",
    path: "/mayas/to",
    img: "mayas/to_icon.png",
    view: "MayasTo",
    component: "MayasTo",
  },
  {
    id: 6,
    title: "Maya Zahlen verstehen",
    path: "/mayas/from",
    img: "mayas/from_icon.png",
    view: "MayasFrom",
    component: "MayasFrom",
  },
  {
    id: 7,
    title: "Maya Zahlen addieren",
    path: "/mayas/addition",
    img: "mayas/addition.png",
    view: "MayasAddition",
    component: "MayasAddition",
  },
  {
    id: 16,
    title: "Zahlen mit Münzen",
    path: "/coins/normal/to",
    img: "coins/normal_to.png",
    view: "NormalCoinsTo",
    component: "CoinsTo",
  },
  {
    id: 17,
    title: "Münzbeträge ausrechnen",
    path: "/coins/normal/from",
    img: "coins/normal_from.png",
    view: "NormalCoinsFrom",
    component: "CoinsFrom",
  },
  {
    id: 18,
    title: "Gleichwertige Münzen tauschen",
    path: "/coins/normal/swap",
    img: "coins/normal_swap.png",
    view: "NormalCoinsSwap",
    component: "CoinsSwap",
  },
  {
    id: 19,
    title: "Bezahlen mit binären Münzen",
    path: "/coins/binary/to",
    img: "coins/binary_to.png",
    view: "BinaryCoinsTo",
    component: "CoinsTo",
  },
  {
    id: 20,
    title: "Binäre Münzbeträge ausrechnen",
    path: "/coins/binary/from",
    img: "coins/binary_from.png",
    view: "BinaryCoinsFrom",
    component: "CoinsFrom",
  },
  {
    id: 15,
    title: "mit Muster entschlüsseln",
    path: "/pattern/decryption",
    img: "ciphertexts/ciphertext_pattern_2.png",
    view: "PatternDecryption",
    component: "PatternDecryption",
  },
  {
    id: 14,
    title: "mit Muster verschlüsseln",
    path: "/pattern/encryption",
    img: "ciphertexts/ciphertext_pattern.png",
    view: "PatternEncryption",
    component: "PatternEncryption",
  },
  {
    id: 13,
    title: "mit Zeichen entschlüsseln",
    path: "/symbol/decryption",
    img: "ciphertexts/symbolsToAbc.png",
    view: "SymbolDecryption",
    component: "SymbolDecryption",
  },
  {
    id: 12,
    title: "mit Zeichen verschlüsseln",
    path: "/symbol/encryption",
    img: "ciphertexts/abcToSymbols.png",
    view: "SymbolEncryption",
    component: "SymbolEncryption",
  },
  {
    id: 8,
    title: "Reihe aus 3 Bäumen",
    path: "/trees/row/3",
    img: "trees/trees_3.png",
    view: "TreeRowOfThree",
    component: "TreeRowOfThree",
  },
  {
    id: 9,
    title: "3x3 Baumsudoku",
    path: "/trees/sudoku/3",
    img: "trees/sudoku_explanation_3.png",
    view: "TreeSudokuOfThree",
    component: "TreeSudokuOfThree",
  },
  {
    id: 10,
    title: "Reihe aus 4 Bäumen",
    path: "/trees/row/4",
    img: "trees/trees_4.png",
    view: "TreeRowOfFour",
    component: "TreeRowOfFour",
  },
  {
    id: 11,
    title: "4x4 Baumsudoku",
    path: "/trees/sudoku/4",
    img: "trees/sudoku_explanation_4.png",
    view: "TreeSudokuOfFour",
    component: "TreeSudokuOfFour",
  },
];

export default views;
