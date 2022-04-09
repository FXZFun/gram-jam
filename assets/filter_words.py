import json 

with open('words.txt') as words, open('../src/words.json', 'w') as out:
    filtered = ['orca', 'toon']
    for word in words:
        word = word.strip()
        if len(word) < 4:
            continue

        if '\'' in word:
            continue
        
        if word in ['spic', 'coon', 'gook', 'cunt', 'nigger', 'nigga', 'fags', 'faggy', 'faggot', 'dike']:
            continue
        
        if word in ['tbsp', 'chge', 'quot', 'natl', 'acct', 'mfrs', 'subj', 'coed']:
            continue

        if word != word.lower():
            continue

        filtered.append(word)
        
    json.dump(filtered, out)
