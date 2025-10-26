export interface WordlistOptions {
  includeLeet: boolean;
  includeCaps: boolean;
  years: string[];
  separators: string[];
}

const leetMap: { [key: string]: string } = {
  a: "4",
  e: "3",
  i: "1",
  o: "0",
  s: "5",
  t: "7",
  l: "1",
  g: "9",
};

function applyLeet(word: string): string[] {
  const results = new Set<string>([word]);

  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (leetMap[char]) {
      const newAdditions: string[] = [];
      results.forEach((w) => {
        const newWord = w.substring(0, i) + leetMap[char] + w.substring(i + 1);
        newAdditions.push(newWord);
      });
      newAdditions.forEach((nw) => results.add(nw));
    }
  }
  return Array.from(results);
}

function applyCaps(word: string): string[] {
  if (!word) return [];
  const variations = new Set<string>();
  variations.add(word.toLowerCase());
  variations.add(word.toUpperCase());
  variations.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return Array.from(variations);
}

export function generateWordlist(
  baseWords: string[],
  options: WordlistOptions
): string[] {
  const finalWordlist = new Set<string>();

  const baseVariations = new Map<string, string[]>();
  baseWords.forEach((word) => {
    let variations = new Set<string>([word]);

    if (options.includeCaps) {
      applyCaps(word).forEach((v) => variations.add(v));
    }

    if (options.includeLeet) {
      const leetVariations = new Set<string>();
      variations.forEach((v) => {
        applyLeet(v).forEach((lv) => leetVariations.add(lv));
      });
      leetVariations.forEach((v) => variations.add(v));
    }

    baseVariations.set(word, Array.from(variations));
    variations.forEach((v) => finalWordlist.add(v));
  });

  baseVariations.forEach((variations) => {
    variations.forEach((v) => {
      options.years.forEach((year) => {
        finalWordlist.add(v + year);
        options.separators.forEach((sep) => {
          finalWordlist.add(v + sep + year);
        });
      });
    });
  });

  if (baseWords.length > 1) {
    for (let i = 0; i < baseWords.length; i++) {
      for (let j = 0; j < baseWords.length; j++) {
        if (i === j) continue;

        const variations1 = baseVariations.get(baseWords[i])!;
        const variations2 = baseVariations.get(baseWords[j])!;

        variations1.forEach((v1) => {
          variations2.forEach((v2) => {
            options.separators.forEach((sep) => {
              finalWordlist.add(v1 + sep + v2);
            });
          });
        });
      }
    }
  }

  return Array.from(finalWordlist).sort();
}
