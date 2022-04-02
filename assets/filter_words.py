import json 

with open('words.txt') as words, open('../src/words.json', 'w') as out:
    filtered = []
    for word in words:
        word = word.strip()
        if len(word) < 4:
            continue

        if '\'' in word:
            continue

        if word != word.lower():
            continue

        filtered.append(word)
        
    json.dump(filtered, out)
