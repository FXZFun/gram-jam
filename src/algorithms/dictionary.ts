import { Trie } from './trie';

export type Dictionary = Trie<string>;

export const loadDictionary = async () => {
  const dictionary = new Trie<string>();

  const request = await fetch('./words.json');
  const words = await request.json();

  words.forEach((w: string) => {
    dictionary.insert(w, w);
  })

  return dictionary;
};