import json 

with open('scrabble_dict.txt') as words,\
        open('../public/words.json', 'w') as out,\
        open('no_definitions.mod.txt') as no_defs:

    no_defs = set(w.strip() for w in no_defs)
    filtered = ['kite']

    for word in words:
        word = word.strip()
        if len(word) < 4 or len(word) > 14:
            continue

        if '\'' in word:
            continue
        
        if word in no_defs:
            continue
        
        if word.lower() in ['spic', 'coon', 'gook', 'cunt', 'nigger', 'nigga', 'fags', 'faggy', 'faggot', 'dike']:
            continue

        filtered.append(word.lower())
        
    json.dump(filtered, out)
