import { Trie } from './trie';
import words from './words.json';

const Dictionary = new Trie();

words.forEach(w => {
  Dictionary.insert(w, w);
})

console.log(Dictionary.get("apple"));

export default Dictionary;