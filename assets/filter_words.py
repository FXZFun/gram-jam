import json 

with open('scrabble_dict.txt') as words, open('../src/words.json', 'w') as out:
    filtered = ['orca', 'toon']
    for word in words:
        word = word.strip()
        if len(word) < 4:
            continue

        if '\'' in word:
            continue
        
        if word.lower() in ['spic', 'coon', 'gook', 'cunt', 'nigger', 'nigga', 'fags', 'faggy', 'faggot', 'dike']:
            continue

        filtered.append(word.lower())
        
    json.dump(filtered, out)
