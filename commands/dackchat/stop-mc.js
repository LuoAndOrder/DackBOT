const AWS = require('aws-sdk');
const commando = require('discord.js-commando');
const discord = require('discord.js');

AWS.config.update({region: 'us-west-2'});

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

const stopmc = async (msg, fleetid) => {

  var params = {
      SplotFleetRequestIds: [
        fleetid
      ]
  };

  try{
    let data = await ec2.cancelSpotFleetRequests(params).promise();
    console.log(data);
  } catch (err) {
      console.log(err, err.stack);
      channel.send('ERROR: ' + err);
  }

  // Send ack to channel that it is starting
  let channel = msg.channel;
  channel.send('ACK, stopping server.');

}

module.exports = class StopMcCommand extends commando.Command {
  constructor(client) {
    console.log("Registering Stop Minecraft command...");
    super(client, {
      name: 'stopmc',
      aliases: ['stopmc'],
      group: 'dackchat',
      memberName: 'stopmc',
      description: 'Stops the DACK minecraft server',
      examples: ['stopmc [spot_fleet_request_id]'],
      args: [
          {
              key: 'fleetId',
              label: 'fleetId',
              prompt: 'What\s the spot fleet request id?',
              type: 'string'
          }
      ]
    });
  }

  async run(msg, {fleetid}) {
    console.log("Bot detected stopmc command from " + msg.author);
    return await stopmc(msg, fleetid);
  }
}