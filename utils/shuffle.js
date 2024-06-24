// bingo shuffle

const shuffle = (arr) => {
  arr.sort(() => Math.random() - 0.5);
  return arr;
};
export default shuffle;
