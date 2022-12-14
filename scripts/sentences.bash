#!/bin/bash

# sentences
for i in {1..1000}; do
    url=$(curl -i -s https://satzgenerator.de/neu | grep location | cut -c 11- | sed 's/\r//')
    sentence=$(curl -s $url | grep "id=\"satz\"" | cut -c 33- | rev | cut -c 6- | rev)
    if [[ ${#sentence} > 30 || "${sentence: -1}" == "?" ]]; then
        continue
    fi
    echo $sentence >>/home/florian/Documents/01_Ausbildung/ETH/Sem7/bsc-thesis/src/assets/ciphertexts/ciphertexts.json
done

# nouns
for i in {1..200}; do
    curl -s https://alex-riedel.de/randV2.php\?anz\=1 | jq '.[]' >>/home/florian/Documents/01_Ausbildung/ETH/Sem7/bsc-thesis/src/assets/ciphertexts/ciphertexts.json
done
