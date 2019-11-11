const commando = require('discord.js-commando');
const rp = require('request-promise');
import config  from '../../config';

const yougif = async (videoId, startTime, duration, channelId) => {
  let base_url = 'https://www.youtube.com/watch?v=';
  let url = base_url + videoId;
  
  try {
    console.log('amazing');
    await rp({
      uri: `${config.dackbotApi.URL}/yougif?url=${url}&startTime=${startTime}&duration=${duration}&channelId=${channelId}`,
      method: 'GET'
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = class YouGifCommand extends commando.Command {
  constructor(client) {
    console.log("Registering YouGif command...");
    super(client, {
      name: 'yougif',
      aliases: ['yougif', 'tubegif', 'giftube'],
      group: 'dackchat',
      memberName: 'yougif',
      description: 'Converts a youtube video into a gif with captions',
      examples: ['yougif dQw4w9WgXcQ 00:01:30 10'],
      args: [
        {
          key: 'videoId',
          label: 'video id',
          prompt: 'What\'s the youtube video id?',
          type: 'string'
        },
        {
          key: 'startTime',
          label: 'start time',
          prompt: 'What is the start time?',
          default: '00:00:00',
          type: 'string'
        },
        {
          key: 'duration',
          label: 'duration',
          prompt: 'What is the duration?',
          default: 10,
          type: 'integer'
        }
      ]
    });
  }

  async run(msg, {videoId, startTime, duration}) {
    const channelId = msg.channel.id;
    console.log("Bot detected yougif command from " + msg.author);
    return await yougif(videoId, startTime, duration, channelId);
  }
}