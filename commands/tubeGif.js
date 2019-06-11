const ytdl = require('youtube-dl');
const ffmpeg = require('fluent-ffmpeg');

let tubeGif = (msg) => {
  let base_url = 'https://www.youtube.com/watch?v=';
  let split = msg.content.split(' ');
  let url = base_url + split[1];
  let startTime = split.length > 2 ? split[2] : '00:00:00';
  let duration = split.length > 3 ? split[3] : '5';

  let options = ['-f 135', '--get-url'];

  ytdl.getInfo(url, options, function (err, info) {
    if (err) {
      console.log(err);
      return
    }

    try {
      ffmpeg(info.url)
        .on('start', function() {
          console.log("Started processing");
        })
        .on('error', function (err) {
          console.log('An error occurred: ' + err.message);
        })
        .seekInput(startTime)
        .duration(duration)
        .format('gif')
        .save('temp.gif')
        .on('end', function() {
          console.log("processing finished");
          msg.channel.send({
            files: [{
              attachment: './temp.gif',
              name: 'temp.gif'
            }]
          });
        })
    } catch (err) {
      console.log(`ERROR: ${err}`);
      console.error(err);
    }
  })
}

module.exports = tubeGif;