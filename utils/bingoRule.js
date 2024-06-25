const { BINGO_PATTERN } = require('../constants/bingoPattern');
exports.bingoRule = (bingoArea) => {
  let count = 0;
  const checkBingo = () => {
    const isBingo = (pattern) =>
      pattern.every((index) => bingoArea[index].state === 1);

    BINGO_PATTERN.forEach((pattern) => {
      if (isBingo(pattern)) count++;
    });
  };
  checkBingo();

  return count;
};
