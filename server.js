"use strict";

const Discord = require('discord.js');
const Registry = require('./registry');

const tubeGif = require('./commands/tubeGif');

const client = new Discord.Client();

let handleHello = (msg) => {
  msg.channel.send('Hello, world!');
}

let handlePre = (msg) => {
  msg.channel.send('Prefix recognized.');
}

Registry.registerExactCommand("!hello", handleHello);
Registry.registerPrefixCommand('!tubegif', tubeGif);

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
});

client.login(process.env.DACKBOT_BOT_TOKEN);