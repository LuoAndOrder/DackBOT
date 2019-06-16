const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const Gfycat = require('gfycat-sdk');
const uuidv4 = require('uuid/v4');
const rp = require('request-promise');
const fs = require('fs');
const Discord = require('discord.js');
const { promisify } = require('util');

const discordHook = new Discord.WebhookClient(process.env.DACKBOT_WEBHOOK_ID, process.env.DACKBOT_WEBHOOK_TOKEN);

async function handleYouGifRequest(body) {
  let {url, startTime, duration} = body;
  await discordHook.send('Beep boop, I am processing...');

  let gfycat = new Gfycat({
    clientId: process.env.GFYCAT_CLIENT_ID,
    clientSecret: process.env.GFYCAT_CLIENT_SECRET
  });

  await gfycat.authenticate()
    .then(res => {
      console.log(res.access_token);
      console.log('token', gfycat.token);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

  let uuid = uuidv4();
  
  let ytOptions = ['-f 22/43/18', '--get-url'];
  const ytdlGetInfo = promisify(ytdl.getInfo);
  await ytdlGetInfo(url, ytOptions).then(async info => {
    // convert to webm
    console.log("YOUTUBE INFO: " + info.video_url);
    await new Promise((resolve, reject) => {
      ffmpeg(info.video_url)
      .setFfmpegPath('/opt/bin/ffmpeg')
      .on('start', function() {
        console.log(`[ffmpeg] Start Processing: ${info.video_url}`);
      })
      .on('progress', (progress) => {
        console.log(`[ffmpeg] ${JSON.stringify(progress)}`);
      })
      .on('error', function(err) {
        reject(err);
      })
      .format('webm')
      .seekInput(startTime)
      .duration(duration)
      .withVideoCodec('libvpx')
      .withVideoBitrate(1024)
      .withAudioCodec('libvorbis')
      .saveToFile(`${uuid}.webm`)
      .on('end', function() {
        resolve();
      })
    })
    .then((result) => {
      console.log(`[ffmpeg] Finished processing. Saved file to: ${uuid}.webm`);
        
      // Get a gfyname
      const headers = {Authorization: gfycat.token};
      rp({
        uri: 'https://api.gfycat.com/v1/gfycats',
          json: true,
          method: 'POST',
          headers,
          body: {url},
      })
      .then(({gfyname, secret}) => {
        console.log(`gfyname: ${gfyname} secret: ${secret}`);

        // Upload it
        rp({
          uri: 'https://filedrop.gfycat.com',
            json: true,
            method: 'POST',
            formData: {
              key: gfyname,
              file: fs.createReadStream(`./${uuid}.webm`),
            },
        })
        .then(() => {
          return ({
            'statusCode': 200,
            'body': JSON.stringify({
              'gfyname': gfyname,
              'gfytoken': gfycat.token
            })
          });
        })
        .catch((err) => {
          discordHook.send('Human, I failed: ' + err.message);
          return ({
            'statusCode': 500,
            'body': err.message
          });
        })
      })
      .catch((err) => {
        discordHook.send('Human, I failed: ' + err.message);
        return({
          'statusCode': 500,
          'body': err.message
        });
      })
    }, (err) => {
      console.log(`[ffmpeg] Error: ${err.message}`);
      discordHook.send('Human, I failed: ' + err.message);
      return({
        'statusCode': 500,
        'body': err.message
      });
    })
    .catch(err => {
      discordHook.send('Human, I failed: ' + err.message);
        return({
          'statusCode': 500,
          'body': err.message
        });
    });
  })
  .catch(err => {
    if (err) {
      console.log(`[ffmpeg] Error: ${err.message}`);
      throw err;
    }
  });
}

exports.handler = async (event, context) => {
  try {
    let body = JSON.parse(event.body);
    return await handleYouGifRequest(body);
  } catch (err) {
    console.log(err);
    return err;
  }
};
