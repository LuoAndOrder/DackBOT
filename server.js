"use strict";

const Commando = require('discord.js-commando');
const path = require('path');

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

console.log(`looking for commands in ${path.join(__dirname, 'commands')}`);

client.login(process.env.DACKBOT_BOT_TOKEN);