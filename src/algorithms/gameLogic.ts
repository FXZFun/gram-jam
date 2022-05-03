import { scoreWord } from "./letters";
import type { Trie } from "./trie";
import type  { Board, Coord, Match, Tile } from "../types";

const coordToStr = (c: Coord) => c.join(',');

export const findWords = (dictionary: Trie<string>, board: Board) => {
  const words: Match[] = [];
  const rows: Record<number, Match[]> = {};
  const cols: Record<number, Match[]> = {};
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      for (const axis of ['row' as const, 'col' as const]) {

        const word = findWord(dictionary, board, i, j, axis);
        if (word.length) {
          const coords = word.map((_, offset): Coord => [
            i + (axis === 'col' ? 0 : offset),
            j + (axis === 'row' ? 0 : offset),
          ]);
          const match = {
            word,
            coords,
            axis,
            score: scoreWord(word),
          };
          words.push(match);
          if (axis === 'row') {
            rows[i] = (rows[i] ?? []).concat([match]);
          } else {
            cols[j] = (cols[j] ?? []).concat([match]);
          }
        }
      }
    }
  }
  
  // eliminate overlapping matches
  removeOverlappingWords(rows);
  removeOverlappingWords(cols);
  
  
  // find intersections
  let intersectingId = -1;
  const row2col: Record<string, Tile[]> = {};
  // loop over cross-product of rows and columns
  for (const [ i1, w1 ] of Object.entries(Object.values(rows).flat())) {
    for (const [ i2, w2 ] of Object.entries(Object.values(cols).flat())) {
      const intersection = getIntersection(w1, w2);

      if (intersection) {
        const [ i, j ] = intersection;
        const intersectingTile = board[i][j];
        // TODO
        row2col[i1].push(intersectingTile);
      }

    }
  }

  const allWords: Match[] = [];
  const seenWords = new Set<string>();
  const intersections: Record<number, string> = {};
  // iterate over all possible pairs of words
  for (const [ i1, w1 ] of Object.entries(words)) {
    // TODO
    const c1 = w1.coords.map(coordToStr);
    for (const [ i2, w2 ] of Object.entries(words).slice(+i1 + 1)) {
      const c2 = w2.coords.map(coordToStr);
      const [ intersection ] = c1.filter(c => c2.includes(c));
      if (!seenWords.has(i2) && intersection != undefined) {
        // don't revisit
        seenWords.add(i2);
        if (w1.axis !== w2.axis) {
          const [ i, j ] = intersection.split(',');
          const intersectingTile = board[i][j];

          // we want to clear horizontal word first
          let [ vert, horiz ] = w1.axis === 'col'
            ? [ w1, w2 ]
            : [ w2, w1 ];
            
          let prevIntersection = c1.find(c => Object.values(intersections).includes(c));
          console.log({ prevIntersection });
          if (prevIntersection) {
            const idx = allWords.findIndex(word => word.coords.map(coordToStr).includes(prevIntersection));
            allWords[idx] = {
              ...allWords[idx],
              word: allWords[idx].word.map(tile => (
                tile.id === intersectingTile.id
                  ? ({ ...tile, id: intersectingId })
                  : tile
              )),
              intersectingTile: {
                ...intersectingTile,
                id: intersectingId,
              }
            }
          } else {
            allWords.push({
              ...horiz,
              word: horiz.word.map(tile => (
                  tile.id === intersectingTile.id
                  // leave tile on board for next match
                    ? ({ ...tile, id: intersectingId })
                    : tile
                )),
              intersection,
              intersectingTile: {
                ...intersectingTile,
                id: intersectingId,
              },
            });
            intersectingId--;
          }
          allWords.push({ ...vert, intersection, intersectingTile });
          intersections[intersectingTile.id] = intersection;

        // same axis
        } else {
          seenWords.add(i2);
          // prefer longer word
          if (w1.word.length < w2.word.length) {
            allWords.push(w2);
          } else {
            allWords.push(w1);
          }
        }
      } else if (!seenWords.has(i1)) {
        console.log('pushing', w1);
        allWords.push(w1);
      }
    }
    seenWords.add(i1);
  }
  console.log(allWords, seenWords);
  return { words: allWords, intersections };
  // return [
  //   ...bonusWords,
  //   ...words
  //     .filter(w => !toOmit.includes(w))
  //     .sort((a, b) => (a.coords[0][1] - b.coords[0][1]) || (b.word.length - a.word.length)),
  // ];
}

const getIntersection = (w1: Match, w2: Match): Coord | undefined => {
  const c1 = w1.coords.map(coordToStr);
  const c2 = w2.coords.map(coordToStr);
  const [ intersection ] = c1.filter(c => c2.includes(c));
  if (intersection) {
    return intersection.split(',').map(x => parseInt(x)) as Coord;
  } else {
    return undefined;
  }
}

const removeOverlappingWords = (
  axis: Record<number, Match[]>
) => {
  // eliminate overlapping matches
  const filteredWords: number[] = [];
  for (const [ idx, words ] of Object.entries(axis)) {
    for (const [ i1, w1 ] of Object.entries(words)) {
      for (const [ i2, w2 ] of Object.entries(words).slice(+i1 + 1)) {
        if (getIntersection(w1, w2)) {
          if (w1.word.length > w2.word.length) {
            filteredWords.push(+i2);
          } else {
            filteredWords.push(+i1);
          }
        }
      }
    }
    axis[idx] = words.filter((w, i) => !filteredWords.includes(i));
  }
}

const findWord = (
  dictionary: Trie<string>,
  board: Board,
  i: number,
  j: number,
  axis: 'row' | 'col',
): Tile[] => {
  const firstTile = board[i][j];
  const firstLetter = firstTile.letter.toLowerCase();
  let currWord = [firstTile];
  let longestWord = [];
  let node = dictionary.getNode(firstLetter);
  // scan rows
  const [ start, end ] = axis === 'row'
    ? [i, board.length]
    : [j, board[0].length];

  for (let k = start + 1; k < end && node; k++) {
    const nextTile = board[axis === 'row' ? k : i][axis === 'col' ? k : j];
    const nextLetter = nextTile.letter.toLowerCase();
    currWord.push(nextTile);
    node = node.children.get(nextLetter.charAt(0));
    if (node && nextLetter.length > 1) {
      node = node.children.get(nextLetter.charAt(1));
    }
    if (node?.terminal) {
      longestWord = [...currWord];
    }
  }
    
  return longestWord;
}

export const getMarqueeText = (match: Match, chain: number) => {
  if (match.score >= 50 || chain >= 5) {
    return '🎆 UNBELIEVABLE!';
  } else if (match.score >= 40 || chain === 4 || match.word.length === 8) {
    return '🎉 INCREDIBLE!';
  } else if (match.score >= 30 || chain === 3 || match.word.length === 7 || match.intersection) {
    return '🎊 IMPRESSIVE!';
  } else if (match.score >= 20 || chain === 2 || match.word.length === 6) {
    return '✨ WOW!';
  } else if (match.score >= 10 || chain === 1 || match.word.length === 5) {
    return '👍 NICE!';
  }
}