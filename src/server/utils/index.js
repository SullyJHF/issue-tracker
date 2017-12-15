import parse from 'parse-duration';

export const convertTime = (timeString) => {
  let time = parse(timeString);
  return time / 1000;
}
