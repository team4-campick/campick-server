const { BINGO_PATTERN } = require('../constants/bingoPattern');
exports.bingoRule = (bingoArea) => {
  const data = {
    count: 0,
    bingoPattern: new Array(BINGO_PATTERN.length).fill(0),
  };
  // const bingoPattern = new Array(BINGO_PATTERN.length).fill(0);
  console.log('bingoPattern', data.bingoPattern);
  console.log('진입완료');
  const isBingo = (pattern) =>
    pattern.every((index) => bingoArea[index].state === 1);
  BINGO_PATTERN.forEach((pattern, i) => {
    if (isBingo(pattern)) {
      data.bingoPattern[i] = pattern;
      data.count++;
    }
  });
  console.log('빙고 체크 완료');
  console.log(data.bingoPattern);

  return data;
};
