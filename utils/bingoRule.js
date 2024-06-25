const { BINGO_PATTERN } = require('../constants/bingoPattern');
exports.bingoRule = (bingoArea) => {
  let count = 0;
  console.log('진입완료');
  const checkBingo = () => {
    console.log('빙고 체크 진행중...');
    const isBingo = (pattern) =>
      pattern.every((index) => bingoArea[index].state === 1);
    BINGO_PATTERN.forEach((pattern) => {
      if (isBingo(pattern)) count++;
    });
    console.log('빙고 체크 완료');
  };
  checkBingo();

  return count;
};
