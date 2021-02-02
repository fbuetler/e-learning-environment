#!/bin/python
import string
import json

ALPHABET = list(string.ascii_lowercase)
MIN_LENGTH = 2
MAX_LENGTH = 6
MIN_SIMILAR_WORDS = 2


def printProgressBar(
    iteration,
    total,
    prefix="",
    suffix="",
    decimals=1,
    length=100,
    fill="█",
    printEnd="\r",
):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str)
    """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + "-" * (length - filledLength)
    print(f"\r{prefix} |{bar}| {percent}% {suffix}", end=printEnd)
    if iteration == total:
        print()


def contains(arr, key):
    left = 0
    right = len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] < key:
            left = mid + 1
        elif arr[mid] > key:
            right = mid - 1
        else:
            return True
    return False


with open("children_nouns.txt", "r") as f:
    children_words = list(map(lambda x: x.lower(), f.read().split("\n")))

with open("wordlist.txt", "r") as f:
    allowed_words = list(map(lambda x: x.lower(), f.read().split("\n")))
allowed_words.sort()

similar_words = {
    "add": {1: dict()},
    "remove": {1: dict()},
    "change": {1: dict(), 2: dict()},
}
l = len(children_words)
for i, word in enumerate(children_words):
    # add
    add = list()
    if len(word) + 1 <= MAX_LENGTH:
        for pos in range(len(word) + 1):
            for letter in ALPHABET:
                w = word[:pos] + letter + word[pos:]
                if contains(allowed_words, w) and not w in add:
                    add.append(w.upper())
        if len(add) >= MIN_SIMILAR_WORDS:
            add.sort()
            similar_words["add"][1][word.upper()] = add

    # remove
    remove = list()
    if len(word) - 1 >= MIN_LENGTH:
        for pos in range(len(word)):
            w = word[:pos] + word[pos + 1 :]
            if contains(allowed_words, w) and not w in remove:
                remove.append(w.upper())
        if len(remove) >= MIN_SIMILAR_WORDS:
            remove.sort()
            similar_words["remove"][1][word.upper()] = remove

    # change
    change = list()
    for pos in range(len(word)):
        for letter in ALPHABET:
            w = word[:pos] + letter + word[pos + 1 :]
            if w != word and contains(allowed_words, w) and not w in change:
                change.append(w.upper())
    if len(change) >= MIN_SIMILAR_WORDS:
        change.sort()
        similar_words["change"][1][word.upper()] = change

    change = list()
    for left_pos in range(len(word)):
        for right_pos in range(left_pos + 1, len(word)):
            for left_letter in ALPHABET:
                for right_letter in ALPHABET:
                    if word[left_pos] == left_letter or word[right_pos] == right_letter:
                        continue
                    w = (
                        word[:left_pos]
                        + left_letter
                        + word[left_pos + 1 : right_pos]
                        + right_letter
                        + word[right_pos + 1 :]
                    )
                    if w != word and contains(allowed_words, w) and not w in change:
                        change.append(w.upper())
    if len(change) >= MIN_SIMILAR_WORDS:
        change.sort()
        similar_words["change"][2][word.upper()] = change

    printProgressBar(i + 1, l, length=10)

with open("similar_words.json", "w") as f:
    f.write(json.dumps(similar_words, sort_keys=True))
