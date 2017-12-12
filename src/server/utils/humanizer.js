import humanizeDuration from 'humanize-duration';

const humanizer = humanizeDuration.humanizer({
  spacer: '',
  delimiter: ' ',
  units: ['w', 'd', 'h', 'm'],
  language: 'shortEn',
  languages: {
    shortEn: {
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
