import { Trie } from './trie';
// import words from './words.json';


export const loadDictionary = async () => {
  const dictionary = new Trie<string>();

  const request = await fetch('./words.json');
  const words = await request.json();

  words.forEach((w: string) => {
    dictionary.insert(w, w);
  })

  return dictionary;
};