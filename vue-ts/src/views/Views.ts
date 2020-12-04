const views: Array<{
  id: number;
  path: string;
  title: string;
  img: string;
  component: string;
}> = [
  {
    id: 1,
    title: "Ähnliche Wörter (hinzufügen)",
    path: "/wordsadd",
    img: "placeholder.jpg",
    component: "WordsAdd",
  },
  {
    id: 2,
    title: "Ähnliche Wörter (ändern)",
    path: "/wordschange",
    img: "placeholder.jpg",
    component: "WordsChange",
  },
  {
    id: 3,
    title: "Ähnliche Wörter (entfernen)",
    path: "/wordsremove",
    img: "placeholder.jpg",
    component: "WordsRemove",
  },
  {
    id: 4,
    title: "Ähnliche Wörter (vertauschen)",
    path: "/wordsswap",
    img: "placeholder.jpg",
    component: "WordsSwap",
  },
  {
    id: 5,
    title: "Maya Zahlen darstellen",
    path: "/mayasto",
    img: "placeholder.jpg",
    component: "MayasTo",
  },
  {
    id: 6,
    title: "Maya Zahlen verstehen",
    path: "/mayasfrom",
    img: "placeholder.jpg",
    component: "MayasFrom",
  },
  {
    id: 7,
    title: "Maya Zahlen addieren",
    path: "/mayasaddition",
    img: "placeholder.jpg",
    component: "MayasAddition",
  },
  {
    id: 12,
    title: "Sätze mit Zeichen chiffrieren",
    path: "/symbolencryption",
    img: "placeholder.jpg",
    component: "SymbolEncryption",
  },
  {
    id: 13,
    title: "Sätze mit Zeichen dechiffrieren",
    path: "/symboldecryption",
    img: "placeholder.jpg",
    component: "SymbolDecryption",
  },
  {
    id: 14,
    title: "Sätze mit Muster chiffrieren",
    path: "/patternencryption",
    img: "placeholder.jpg",
    component: "PatternEncryption",
  },
  {
    id: 15,
    title: "Sätze mit Muster dechiffrieren",
    path: "/patterndecryption",
    img: "placeholder.jpg",
    component: "PatternDecryption",
  },
  {
    id: 8,
    title: "Reihe aus 3 Bäumen",
    path: "/treerow3",
    img: "placeholder.jpg",
    component: "TreeRowOfThree",
  },
  {
    id: 9,
    title: "3x3 Baumsudoku",
    path: "/treesudoku3",
    img: "placeholder.jpg",
    component: "TreeSudokuOfThree",
  },
  {
    id: 10,
    title: "Reihe aus 4 Bäumen",
    path: "/treerow4",
    img: "placeholder.jpg",
    component: "TreeRowOfFour",
  },
  {
    id: 11,
    title: "4x4 Baumsudoku",
    path: "/treesudoku4",
    img: "placeholder.jpg",
    component: "TreeSudokuOfFour",
  },
];

export default views;
