import configFile from '../../config';

export default function() {
  return configFile;
};

export async function updateConfig(config) {
  return new Promise((resolve, reject) => {
    fs.writeFile('../../config.json', JSON.stringify(config), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
