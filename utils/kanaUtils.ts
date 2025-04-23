/**
 * 小さいひらがな（ぁ、ぃ、ぅ、ぇ、ぉ、ゃ、ゅ、ょ）を判定する
 * @param yomi 入力文字列（仮名文字列）
 * @param i 現在のインデックス
 * @param margin 次の文字へのオフセット
 * @returns 小さいひらがなである場合に true を返す
 */
export const checkSmallHira = (
  yomi: string,
  i: number,
  margin: number
): boolean => {
  const index = i + margin;
  const checkYomi = yomi[index];
  return (
    checkYomi === "ぁ" ||
    checkYomi === "ぃ" ||
    checkYomi === "ぅ" ||
    checkYomi === "ぇ" ||
    checkYomi === "ぉ" ||
    checkYomi === "ゃ" ||
    checkYomi === "ゅ" ||
    checkYomi === "ょ"
  );
};

/**
 * 「ん」の後に特定の文字が続くかを判定する
 * @param yomi 入力文字列（仮名文字列）
 * @param i 現在のインデックス
 * @returns 条件を満たす場合に true を返す
 */
export const checkAfterN = (yomi: string, i: number): boolean => {
  const index = i + 1;
  const checkYomi = yomi[index];
  return (
    checkYomi === "あ" ||
    checkYomi === "い" ||
    checkYomi === "う" ||
    checkYomi === "え" ||
    checkYomi === "お" ||
    checkYomi === "な" ||
    checkYomi === "に" ||
    checkYomi === "ぬ" ||
    checkYomi === "ね" ||
    checkYomi === "の" ||
    checkYomi === undefined
  );
};
