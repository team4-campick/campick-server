exports.missionClearCounter = (bingoArea) => {
  let count = 0;
  console.log("bingoArea", bingoArea);
  Array.from(bingoArea).forEach((e) => {
    if (e.state === 1) count++;
    console.log("클리어한 미션을 카운팅 합니다2.", count);
  });
  return count;
};
