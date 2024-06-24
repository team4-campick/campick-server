const bingoRule = (bingoArea) => {
  let count = 0;
  const checkBingo = () => {
    const bingoPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const isBingo = (pattern) =>
      pattern.every((index) => bingoArea[index].state === 1);

    bingoPatterns.forEach((pattern) => {
      if (isBingo(pattern)) count++;
    });
  };
  checkBingo();

  return count;
};

export default bingoRule;
