const rp = require('request-promise');
import config  from '../config';

const yougif = async (msg) => {
  let regex = new RegExp("youtube.com\\/watch\\?v=([a-zA-Z0-9_-]{11})");
  let url, startTime, duration;
  let split = msg.content.split(' ');
  
  if (regex.test(msg.content)) {
    url = split[0];
    startTime = split.length > 1 ? split[1] : '00:00:00';
    duration = split.lenght > 2 ? split[2] : '10';
  } else {
    let base_url = 'https://www.youtube.com/watch?v=';
    url = base_url + split[1];
    startTime = split.length > 2 ? split[2] : '00:00:00';
    duration = split.length > 3 ? split[3] : '10';
  }

  try {
    await rp({
      uri: `${config.dackbotApi.URL}/yougif?url=${url}&startTime=${startTime}&duration=${duration}`,
      method: 'GET'
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = yougif;