"use strict";

const Discord = require('discord.js');
const Registry = require('./registry');

const tubeGif = require('./commands/tubeGif');

const client = new Discord.Client();

let handleHello = (msg) => {
  msg.channel.send('Hello, world!');
}

Registry.registerExactCommand("!hello", handleHello);
Registry.registerPrefixCommand('!tubegif', tubeGif);
Registry.registerRegexCommand("youtube.com\\/watch\\?v=([a-zA-Z0-9_-]{11})", tubeGif);

client.on('message', msg => {
  let lowerMsg = msg.content.toLowerCase();
  let exactCommands = Registry.getExactCommandCallbacks();
  if (lowerMsg in exactCommands) {
    return exactCommands[lowerMsg](msg);
  }

  let prefixCommands = Registry.getPrefixCommandCallbacks();
  for (var prefixCommand in prefixCommands) {
    if (lowerMsg.startsWith(prefixCommand + ' ')) {
      console.log(prefixCommands[prefixCommand]);
      return prefixCommands[prefixCommand](msg);
    }
  }

  let regexCommands = Registry.getRegexCommandCallbacks();
  for (var regexCommand in regexCommands) {
    let regex = new RegExp(regexCommand);
    if(regex.test(lowerMsg)) {
      console.log(regexCommands[regexCommand]);
      return regexCommands[regexCommand](msg);
    }
  }
});

client.login(process.env.DACKBOT_BOT_TOKEN);