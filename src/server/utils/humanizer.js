import humanizeDuration from 'humanize-duration';

const humanizer = humanizeDuration.humanizer({
  spacer: '',
  delimiter: ' ',
  language: 'shortEn',
  languages: {
    shortEn: {
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms'
    }
  }
});

export default humanizer;
