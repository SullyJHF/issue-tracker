import humanizeDuration from 'humanize-duration';

const humanizer = humanizeDuration.humanizer({
  spacer: '',
  delimiter: ' ',
  units: ['w', 'd', 'h', 'm', 's'],
  round: true,
  language: 'shortEn',
  languages: {
    shortEn: {
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's'
    }
  }
});

export default humanizer;
