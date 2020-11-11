#!/bin/python
import time
from random import seed, shuffle

SUDOKU_SIZE = 3


def print_sudoku(sudoku):
    for row in sudoku:
        for el in row:
            print("{} ".format(el if el is not None else "?"), end="")
        print()
    print()


def find_empty_slot(sudoku):
    row_indexes = list(range(SUDOKU_SIZE))
    col_indexes = list(range(SUDOKU_SIZE))
    shuffle(row_indexes)
    shuffle(col_indexes)
    for i in row_indexes:
        for j in col_indexes:
            if sudoku[i][j] is None:
                return (i, j)
    return (None, None)


def is_valid(sudoku):
    for i in range(SUDOKU_SIZE):
        row_seen = set()
        col_seen = set()
        for j in range(SUDOKU_SIZE):
            for el, seen in [(sudoku[i][j], row_seen), (sudoku[j][i], col_seen)]:
                if el in seen:
                    return False
                elif el is None:
                    continue
                else:
                    seen.add(el)
    return True


def solve_sudoku(sudoku, solutions=0, verbose=False):
    row, col = find_empty_slot(sudoku)
    if row is None or col is None:
        if verbose:
            print_sudoku(sudoku)
            print("solution found")
        return solutions + 1

    numbers = list(range(1, SUDOKU_SIZE + 1))
    shuffle(numbers)
    for number in numbers:
        sudoku[row][col] = number
        if is_valid(sudoku):
            solutions = solve_sudoku(sudoku, solutions=solutions, verbose=verbose)
            if solutions > 1:
                break

    sudoku[row][col] = None
    return solutions


def generate_sudoku(sudoku):
    row, col = find_empty_slot(sudoku)
    if row is None or col is None:
        return sudoku

    numbers = list(range(1, SUDOKU_SIZE + 1))
    shuffle(numbers)
    for number in numbers:
        sudoku[row][col] = number
        if is_valid(sudoku):
            solutions = solve_sudoku(sudoku)
            if solutions == 0:
                continue
            elif solutions == 1:
                return sudoku
            else:
                return generate_sudoku(sudoku)

    return sudoku


seed(time.time())

unsolved_sudoku = [[None, None, None], [None, None, 1], [3, None, None]]
solved_sudoku = [[1, 2, 3], [2, 3, 1], [3, 1, 2]]

empty_sudoku = [[None for _ in range(SUDOKU_SIZE)] for _ in range(SUDOKU_SIZE)]
new_sudoku = generate_sudoku(empty_sudoku)
print_sudoku(new_sudoku)

solutions = solve_sudoku(new_sudoku, verbose=True)
print("# of solutions: {}".format(solutions))
assert solutions == 1