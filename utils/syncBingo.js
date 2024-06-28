exports.syncBingo = (curBingo, newBingo) => {
  console.log("syncBingo", curBingo.bingo);
  console.log("syncBingo", newBingo);
  Array.from(curBingo.bingo).forEach((e) => {
    newBingo.forEach((element) => {
      if (e.mission === element.mission) {
        [e.state, element.state] = [element.state, e.state];
      }
    });
  });
  console.log("syncBingo", curBingo);
  return curBingo;
};
