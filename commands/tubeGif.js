const ytdl = require('youtube-dl');
const ffmpeg = require('fluent-ffmpeg');
const Gfycat = require('gfycat-sdk');
const rp = require('request-promise');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

function checkUpdate(gfyname, token) {
  const headers = {Authorization: token};
  return rp({
    uri: `https://api.gfycat.com/v1/gfycats/fetch/status/${gfyname}`,
    method: 'GET',
    headers
  })
}

function checkCompletion(gfyname, token) {
  let retries = 0;
  return new Promise(function (resolve, reject) {
    (function waitForComplete(){
      checkUpdate(gfyname, token)
      .then((result) => {
        let task = JSON.parse(result);
        if (task.task === 'complete' || task.task === 'error') {
          console.log(`Task: ${task.task}`);
          return resolve();
        }
        retries += 1;
        if (retries == 5) return resolve();
        console.log(`Task: ${task.task} retry#${retries}`);
        setTimeout(waitForComplete, 10000);
      })
    })();
  });
}

let tubeGif = async (msg) => {
  let regex = new RegExp("youtube.com\\/watch\\?v=([a-zA-Z0-9_-]{11})");
  let url, startTime, duration;
  if (regex.test(msg.content)) {
    let split = msg.content.split(' ');
    url = split[0];
    startTime = split.length > 1 ? split[1] : '00:00:00';
    duration = split.lenght > 2 ? split[2] : '10';
  } else {
    let base_url = 'https://www.youtube.com/watch?v=';
    let split = msg.content.split(' ');
    url = base_url + split[1];
    startTime = split.length > 2 ? split[2] : '00:00:00';
    duration = split.length > 3 ? split[3] : '10';
  }

  msg.channel.send("Beep boop. I am processing...");

  let gfycat = new Gfycat({
    clientId: process.env.GFYCAT_CLIENT_ID,
    clientSecret: process.env.GFYCAT_CLIENT_SECRET
  });

  gfycat.authenticate((err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('token', gfycat.token);
  });

  let uuid = uuidv4();

  let ytOptions = ['-f 22/43/18', '--get-url'];
  ytdl.getInfo(url, ytOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }

    try {
      ffmpeg(info.url)
        .on('start', function() {
          console.log("Started processing");
        })
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message);
          msg.channel.send("Human, I have failed you: " + err.message);
        })
        .seekInput(startTime)
        .duration(duration)
        .withVideoCodec('libvpx')
        .withVideoBitrate(1024)
        .withAudioCodec('libvorbis')
        .saveToFile(`${uuid}.webm`)
        .on('end', function() {
          console.log("processing finished");
          const headers = {Authorization: gfycat.token};
          return rp({
            uri: 'https://api.gfycat.com/v1/gfycats',
            json: true,
            method: 'POST',
            headers,
            body: {url},
          })
          .then(({gfyname, secret}) => {
            console.log(`gfyname: ${gfyname}, secret: ${secret}`);

            return rp({
              uri: 'https://filedrop.gfycat.com',
              json: true,
              method: 'POST',
              formData: {
                key: gfyname,
                file: fs.createReadStream(`./${uuid}.webm`),
              },
            })
            .then(() => {
              return checkCompletion(gfyname, gfycat.token)
              .then(() => {
                msg.channel.send(`https://gfycat.com/${gfyname}`)
                fs.unlinkSync(`./${uuid}.webm`);
                return Promise.resolve();
              });
            })
            .catch((err) => {
              msg.channel.send("Human, I have failed you: " + err.message);
              Promise.reject(err);
            })
          });
        });
    } catch (err) {
      console.log(`ERROR: ${err}`);
      console.error(err);
      msg.channel.send("Human, I have failed you: " + err.message);
    }
  })
}

module.exports = tubeGif;