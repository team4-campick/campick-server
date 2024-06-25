exports.missionClearCounter = (bingoArea) => {
  let count = 0;
  console.log('bingoArea', bingoArea);
  Array.from(bingoArea.bingo).forEach((e) => {
    if (e.state === 1) count++;
  });
  return count;
};
