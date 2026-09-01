function levenshtein(a, b) {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const matrix = Array.from({ length: aLen + 1 }, () => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) matrix[i][0] = i;
  for (let j = 0; j <= bLen; j++) matrix[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[aLen][bLen];
}

function fuzzyWordScore(tw, nw) {
  if (tw === nw) return 100;
  if (nw.includes(tw) || tw.includes(nw)) return 80;
  if (nw.startsWith(tw) || tw.startsWith(nw)) return 70;

  const shorter = tw.length < nw.length ? tw : nw;
  const longer = tw.length < nw.length ? nw : tw;

  if (shorter.length < 3) return 0;

  const dist = levenshtein(shorter, longer.slice(0, shorter.length + 2));
  const maxDist = Math.floor(shorter.length * 0.45);

  if (dist <= maxDist) {
    return Math.round(60 * (1 - dist / (shorter.length + 1)));
  }

  return 0;
}

export function scoreProduct(product, term) {
  const termLower = term.toLowerCase();
  const termWords = termLower.split(/\s+/).filter(Boolean);

  const name = (product.productName || product.name || "").toLowerCase();
  const nameWords = name.split(/\s+/);

  let bestScore = 0;

  if (name === termLower) {
    bestScore = 100;
  } else if (name.startsWith(termLower)) {
    bestScore = 92;
  } else if (name.includes(termLower)) {
    bestScore = 70 + Math.round((termLower.length / name.length) * 25);
  } else {
    for (const tw of termWords) {
      for (const nw of nameWords) {
        const s = fuzzyWordScore(tw, nw);
        if (s >= 60) {
          bestScore = Math.max(bestScore, Math.round((s / 100) * 70));
        }
      }
    }

    if (bestScore === 0) {
      let matchedCount = 0;
      for (const tw of termWords) {
        for (const nw of nameWords) {
          if (fuzzyWordScore(tw, nw) > 0) {
            matchedCount++;
            break;
          }
        }
      }
      if (matchedCount > 0) {
        bestScore = Math.round((matchedCount / termWords.length) * 55);
      }
    }
  }

  const allTags = Array.isArray(product.tags) ? [...product.tags] : [];
  if (product.badge && !allTags.includes(product.badge)) allTags.push(product.badge);
  const uniqueTags = [...new Set(allTags.map((t) => t.toLowerCase()))];

  let tagScore = 0;
  for (const tag of uniqueTags) {
    if (tag === termLower) {
      tagScore = Math.max(tagScore, 80);
    } else if (tag.startsWith(termLower) || termLower.startsWith(tag)) {
      tagScore = Math.max(tagScore, 65);
    } else if (tag.includes(termLower) || termLower.includes(tag)) {
      tagScore = Math.max(tagScore, 50);
    } else {
      const tagWords = tag.split(/\s+/);
      for (const tw of termWords) {
        for (const tw2 of tagWords) {
          const s = fuzzyWordScore(tw, tw2);
          if (s > 0) {
            tagScore = Math.max(tagScore, Math.round((s / 100) * 45));
          }
        }
      }
    }
  }
  bestScore = Math.max(bestScore, tagScore);

  const category = (
    typeof product.category === "object" ? product.category?.name : product.category
  ) || "";
  const categoryLower = category.toLowerCase();
  if (categoryLower === termLower) {
    bestScore = Math.max(bestScore, 45);
  } else if (categoryLower.includes(termLower) || termLower.includes(categoryLower)) {
    bestScore = Math.max(bestScore, 30);
  } else {
    for (const tw of termWords) {
      if (fuzzyWordScore(tw, categoryLower) > 0) {
        bestScore = Math.max(bestScore, 20);
      }
    }
  }

  const subCat = (
    typeof product.subCategory === "object" ? product.subCategory?.name : product.subCategory
  ) || "";
  const subCatLower = subCat.toLowerCase();
  if (subCatLower === termLower) {
    bestScore = Math.max(bestScore, 40);
  } else if (subCatLower.includes(termLower) || termLower.includes(subCatLower)) {
    bestScore = Math.max(bestScore, 25);
  } else {
    for (const tw of termWords) {
      if (fuzzyWordScore(tw, subCatLower) > 0) {
        bestScore = Math.max(bestScore, 15);
      }
    }
  }

  const brand = (product.brand || product.manufacturer || "").toLowerCase();
  if (brand === termLower) {
    bestScore = Math.max(bestScore, 35);
  } else if (brand.includes(termLower) || termLower.includes(brand)) {
    bestScore = Math.max(bestScore, 20);
  }

  const description = (product.description || "").toLowerCase();
  if (description.includes(termLower)) {
    bestScore = Math.max(bestScore, 10);
  }

  return bestScore;
}

export function fuzzyFilterAndSort(products, searchTerm) {
  if (!searchTerm) return products;

  const term = searchTerm.toLowerCase().trim();
  if (!term) return products;

  const scored = products.map((p) => ({
    ...p,
    _score: scoreProduct(p, term),
  }));

  const hasAnyMatch = scored.some((p) => p._score > 0);
  if (!hasAnyMatch) return products;

  return scored
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score);
}
