import { Trie } from './trie';
import words from './words.json';

const Dictionary = new Trie();

words.forEach(w => {
  Dictionary.insert(w, w);
})

export default Dictionary;