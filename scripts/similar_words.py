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
    # Print New Line on Complete
    if iteration == total:
        print()


resp = requests.get(
    "http://pcai056.informatik.uni-leipzig.de/downloads/etc/legacy/Papers/top10000de.txt"
)

words = list(map(lambda x: x.lower(), resp.text.split("\n")[:-1]))

sim = dict()
l = len(words)
for i, a in enumerate(words):
    if len(a) == 1:
        continue
    matches = list()
    for b in words:
        if a == b or len(b) == 1:
            continue

        # insert
        for letter in list(map(chr, range(ord("a"), ord("z") + 1))):
            for pos in range(len(a) + 1):
                if a[:pos] + letter + a[pos:] == b:
                    matches.append(b)

        # remove
        for pos in range(len(a)):
            if a[:pos] + a[pos + 1 :] == b:
                matches.append(b)

        # change
        if len(a) != len(b):
            continue
        distance = 0
        for pos in range(len(a)):
            distance += 1 if a[pos] != b[pos] else 0
        if distance == 1:
            matches.append(b)

    if len(matches) != 0:
        sim[a] = matches
    printProgressBar(i + 1, l, prefix="Progress:", suffix="Complete", length=50)

for k, v in sorted(sim.items(), key=lambda elem: len(elem[1])):
    print("{} - {}".format(k, v))
