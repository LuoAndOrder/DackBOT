"use strict";

const Commando = require('discord.js-commando');
const path = require('path');

//const GIF_EMOJI_ID = '643557229894696994';
const GIF_EMOJI_ID = '584072611382689801'; //pika

const getYoutubeVideoId = function(text) {
  let youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)(?<videoid>[\w\-]+)(\S+)?$/;
  let match = text.match(youtubeRegex);
  if (match && match.groups.videoid) {
    return match.groups.videoid;
  }
  return null;
}

const client = new Commando.Client({
  owner: process.env.DACKBOT_OWNER_ID,
  commandPrefix: '-'
});

client.registry
  .registerGroups([
    ['dackchat', 'DACK commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('message', msg => {
  let youtubeVideoId = getYoutubeVideoId(msg.content);
  if (youtubeVideoId) {
    console.log('detected videoid: ' + youtubeVideoId);
    msg.react(msg.guild.emojis.get(GIF_EMOJI_ID));
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  console.log('Detected reaction');
  if(reaction.emoji.id == GIF_EMOJI_ID && !user.bot && reaction.users.has(client.user.id)) {
    console.log('Time to gfy this message: ' + reaction.message.content);
    let videoId = getYoutubeVideoId(reaction.message.content);
    if (videoId) {
      reaction.remove(client.user);
      client.registry.commands.get('yougif').run(reaction.message, {
        'videoId': videoId,
        'startTime': '00:00:00',
        'duration': 15,
        'channelId': reaction.message.channel.id
      });
    }
  }
});

client.on('raw', packet => {
  if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;

  console.log("Detected raw reaction");

  const channel = client.channels.get(packet.d.channel_id);
  if (channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    const reaction = message.reactions.get(emoji);
    if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
    if(packet.t === 'MESSAGE_REACTION_ADD') {
      console.log("Emitting raw reaction add event");
      client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
    }
  })
});


console.log(`looking for commands in ${path.join(__dirname, 'commands')}`);

client.login(process.env.DACKBOT_BOT_TOKEN);