import time
from random import seed, shuffle, randint

SUDOKU_SIZE = 4


class TreeSudoku:
    """
    example:
      ? ? ?
    1 ? 1 ? ?
    ? 2 ? ? ?
    ? ? ? 3 ?
      ? ? ?
    """

    def __init__(self, perspectives, sudoku):
        if len(perspectives) != 4 or len(sudoku) != SUDOKU_SIZE:
            raise Exception("invalid args")
        for perspective in perspectives:
            if len(perspective) != SUDOKU_SIZE:
                raise Exception("invalid args")
        for row in sudoku:
            if len(row) != SUDOKU_SIZE:
                raise Exception("invalid args")

        self.perspectives = perspectives  # top, left, right, bottom
        self.sudoku = sudoku  # row for row

    def print(self):
        empty_perspective_symbol = " "
        empty_sudokut_symbol = "?"
        print("  ", end="")
        for el in self.perspectives[0]:
            print(
                "{} ".format(el if el is not None else empty_perspective_symbol), end=""
            )
        print()
        for i, row in enumerate(self.sudoku):
            print(
                "{} ".format(
                    self.perspectives[1][i]
                    if self.perspectives[1][i] is not None
                    else empty_perspective_symbol
                ),
                end="",
            )
            for el in row:
                print(
                    "{} ".format(el if el is not None else empty_sudokut_symbol), end=""
                )
            print(
                "{} ".format(
                    self.perspectives[2][i]
                    if self.perspectives[2][i] is not None
                    else empty_perspective_symbol
                )
            )
        print("  ", end="")
        for el in self.perspectives[3]:
            print(
                "{} ".format(el if el is not None else empty_perspective_symbol), end=""
            )
        print()
        print()

    def find_empty_sudoku_slot(self):
        rows = list(range(SUDOKU_SIZE))
        cols = list(range(SUDOKU_SIZE))
        shuffle(rows)
        shuffle(cols)
        for i in rows:
            for j in cols:
                if self.sudoku[i][j] is None:
                    return (i, j)
        return (None, None)

    def find_empty_perspective_slot(self):
        perspectives = list(range(4))
        indexes = list(range(SUDOKU_SIZE))
        shuffle(perspectives)
        shuffle(indexes)
        for p in perspectives:
            for i in indexes:
                if self.perspectives[p][i] is None:
                    return (p, i)
        return (None, None)

    def get_visible_trees(self, line):
        min = 0
        visibile = 0
        for tree in line:
            if tree > min:
                visibile += 1
                min = tree
        return visibile

    def is_valid(self):
        for i in range(SUDOKU_SIZE):
            row_seen = set()
            col_seen = set()
            for j in range(SUDOKU_SIZE):
                for el, seen in [
                    (self.sudoku[i][j], row_seen),
                    (self.sudoku[j][i], col_seen),
                ]:
                    if el in seen:
                        return False
                    elif el is None:
                        continue
                    else:
                        seen.add(el)

            if len(row_seen) == SUDOKU_SIZE:
                visible_left = self.get_visible_trees(self.sudoku[i])
                visible_right = self.get_visible_trees(self.sudoku[i][::-1])
                if (
                    self.perspectives[1][i] is not None
                    and visible_left != self.perspectives[1][i]
                ) or (
                    self.perspectives[2][i] is not None
                    and visible_right != self.perspectives[2][i]
                ):
                    return False

            if len(col_seen) == SUDOKU_SIZE:
                col = [row[i] for row in self.sudoku]
                visible_top = self.get_visible_trees(col)
                visible_bottom = self.get_visible_trees(col[::-1])
                if (
                    self.perspectives[0][i] is not None
                    and visible_top != self.perspectives[0][i]
                ) or (
                    self.perspectives[3][i] is not None
                    and visible_bottom != self.perspectives[3][i]
                ):
                    return False

        return True

    def solve(self, solutions=0, verbose=False):
        row, col = self.find_empty_sudoku_slot()
        if row is None or col is None:
            if verbose:
                self.print()
                print("solution found")
            return solutions + 1

        numbers = list(range(1, SUDOKU_SIZE + 1))
        shuffle(numbers)
        for number in numbers:
            self.sudoku[row][col] = number
            if self.is_valid():
                solutions = self.solve(solutions=solutions, verbose=verbose)
                if solutions > 1:
                    break

        self.sudoku[row][col] = None
        return solutions


def generate(ts=None):
    if ts is None:
        ts = TreeSudoku(
            [[None for _ in range(SUDOKU_SIZE)] for _ in range(4)],
            [[None for _ in range(SUDOKU_SIZE)] for _ in range(SUDOKU_SIZE)],
        )

    row, col = ts.find_empty_sudoku_slot()
    if row is None or col is None:
        return ts

    perspective, index = ts.find_empty_perspective_slot()
    if perspective is None:
        return ts

    fill_sudoku = randint(0, 1) == 1
    numbers = list(range(1, SUDOKU_SIZE + 1))
    shuffle(numbers)
    for number in numbers:
        if fill_sudoku:
            ts.sudoku[row][col] = number
        else:
            ts.perspectives[perspective][index] = number

        if ts.is_valid():
            solutions = ts.solve()
            if solutions == 0:
                continue
            elif solutions == 1:
                return ts
            else:
                return generate(ts=ts)
        else:
            ts.perspectives[perspective][index] = None
            ts.sudoku[row][col] = None

    return ts


seed(time.time())

# ts_unsolved = TreeSudoku(
#     [
#         [None, None, None],
#         [1, None, None],
#         [None, None, None],
#         [None, None, None],
#     ],
#     [[None, 1, None], [2, None, None], [None, None, 3]],
# )

# ts_complete = TreeSudoku(
#     [
#         [None, None, None],
#         [1, None, None],
#         [None, None, None],
#         [None, None, None],
#     ],
#     [[3, 1, 2], [2, 3, 1], [1, 2, 3]],
# )

ts_new = generate()
ts_new.print()
ts_new.solve(verbose=True)