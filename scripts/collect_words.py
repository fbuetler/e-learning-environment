import requests
import string
from bs4 import BeautifulSoup

ALPHABET = list(string.ascii_uppercase)
WORD_MIN_LENGTH = 2
WORD_MAX_LENGTH = 8
CHILDREN_NOUNS_AMOUNT = 500


def print_progress_bar(
    iteration,
    total,
    prefix="",
    suffix="",
    decimals=1,
    length=100,
    fill="█",
    printEnd="\r",
):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + "-" * (length - filledLength)
    print(f"\r{prefix} |{bar}| {percent}% {suffix}", end=printEnd)
    if iteration == total:
        print()


def has_illegal_char(word):
    return "ä" in word or "ö" in word or "ü" in word or "ß" in word


def collect_scrabble_words(length, letter):
    try:
        url = "https://scrabblemania.de/Worter-Mit-{}-Buchstaben-Die-Mit-{}-Anfangen".format(
            length, letter
        )
        resp = requests.get(url)
        soup = BeautifulSoup(resp.text, "html.parser")
        content = soup.findAll("div", {"class": "content"})[0]
        links = content.findAll("a")
        words = list(map(lambda l: l.contents[0], links))
        return words
    except Exception as e:
        print("caught exception in 'collect scrabble': {}".format(e))
        return []


def collect_children_noun():
    try:
        noun = ""
        while (
            len(noun) < WORD_MIN_LENGTH
            or WORD_MAX_LENGTH < len(noun)
            or has_illegal_char(noun)
        ):
            url = "https://www.palabrasaleatorias.com/zufallige-worter.php?fs=1&fs2=1&Submit=Neues+Wort"
            resp = requests.get(url)
            soup = BeautifulSoup(resp.text, "html.parser")
            noun = (
                soup.select_one('div[style*="font-size:3em; color:#6200C5"]')
                .contents[0]
                .strip("\r")
                .strip("\n")
            )
        return noun
    except Exception as e:
        print("caucht exception in 'collect children': {}".format(e))
        return ""


def word_exists(word):
    try:
        resp = requests.get(
            "https://scrabble123.de/scrabble-worterbuch/{}".format(word)
        )
        return not ("nicht erlaubt" in resp.text)
    except Exception as e:
        print("caught exception in 'exists': {}".format(e))
        return False


def is_noun(word):
    try:
        url = "https://www.verbformen.de/deklination/substantive/{}.htm".format(word)
        resp = requests.get(url)
        return not ("nicht gefunden" in resp.text)
    except Exception as e:
        print("caucht exception in 'check': {}".format(e))
        return False


def scrabble_words():
    collected_scrabble_words = list()
    alphabet_length = len(ALPHABET)
    for i, letter in enumerate(ALPHABET):
        for length in range(WORD_MIN_LENGTH, WORD_MAX_LENGTH):
            words = collect_scrabble_words(length, letter)
            [collected_scrabble_words.append(word) for word in words]
        print_progress_bar(i + 1, alphabet_length, prefix="scrabble", length=10)

    with open("scrabble_words.txt", "w") as f:
        for word in collected_scrabble_words:
            if has_illegal_char(word):
                continue
            f.write("{}\n".format(word))


def children_words():
    collected_children_nouns = list()
    for i in range(CHILDREN_NOUNS_AMOUNT):
        noun = collect_children_noun()
        collected_children_nouns.append(noun)
        print_progress_bar(i + 1, CHILDREN_NOUNS_AMOUNT, prefix="children", length=10)

    with open("children_nouns.txt", "w") as f:
        for noun in collected_children_nouns:
            f.write("{}\n".format(noun))


scrabble_words()
children_words()
