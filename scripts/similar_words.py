#!/bin/python
import requests


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


def word_exists(word):
    try:
        resp = requests.get(
            "https://scrabble123.de/scrabble-worterbuch/{}".format(word)
        )
        return not ("nicht erlaubt" in resp.text)
    except Exception:
        print("caught exception")
        return False


# https://scrabblemania.de/Alle-Worter
# https://scrabble123.de/scrabble-worterbuch
with open("words.txt", "r") as f:
    words = list(map(lambda x: x.lower(), f.read().split("\n")[:-1]))

sim_insert = dict()
sim_remove = dict()
sim_change = dict()
l = len(words)
alphabet = list(map(chr, range(ord("a"), ord("z") + 1)))
for i, a in enumerate(words):
    if len(a) <= 4 or "." in a:
        continue
    insert = list()
    remove = list()
    change = list()

    # insert
    for pos in range(len(a) + 1):
        for letter in alphabet:
            w = a[:pos] + letter + a[pos:]
            if word_exists(w) and not w in insert:
                insert.append(w)
    if len(insert) != 0:
        sim_insert[a] = insert

    # remove
    for pos in range(len(a)):
        w = a[:pos] + a[pos + 1 :]
        if word_exists(w) and not w in remove:
            remove.append(w)
    if len(remove) != 0:
        sim_remove[a] = remove

    # change
    distance = 0
    for pos in range(len(a)):
        for letter in alphabet:
            w = a[:pos] + letter + a[pos + 1 :]
            if w != a and word_exists(w) and not w in change:
                change.append(w)
    if len(change) != 0:
        sim_change[a] = change

    print(chr(27) + "[2J")
    print(sim_insert)
    print(sim_remove)
    print(sim_change)

    printProgressBar(i + 1, l, prefix="Progress:", suffix="Complete", length=50)

with open("words.json", "w") as f:
    f.write("{\n")
    for name, sim in [
        ('"insert"', sim_insert),
        ('"remove"', sim_remove),
        ('"change"', sim_change),
    ]:
        f.write(name + ": {\n")
        for k, v in sorted(sim.items(), key=lambda elem: len(elem[1])):
            if len(v) >= 3:
                f.write('"{}": {},\n'.format(k, v))
        f.write("},\n")
    f.write("}\n")
