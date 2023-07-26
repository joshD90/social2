//lifted straight from online.  Implements the levenshtein distance algorithm
export const fuzzySearch = (query: string, array: string[]): string[] => {
  const results: string[] = [];

  for (const item of array) {
    const distance = levenshteinDistance(query, item);
    const similarity = 1 - distance / Math.max(query.length, item.length);

    if (similarity >= 0.8) {
      results.push(item);
    }
  }

  return results;
};

const levenshteinDistance = (s1: string, s2: string): number => {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
};
