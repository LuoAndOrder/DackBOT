const AWS = require('aws-sdk');
const commando = require('discord.js-commando');
const discord = require('discord.js');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

AWS.config.update({region: 'us-west-2'});

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

const serverTypeToLaunchTemplateId = {
    'primordial': 'lt-0486d51cb54f8c675',
    'sevtech': 'lt-068d2b31710c57641',
    'me5': 'lt-0aed89efdd765cc87'
}

const serverTypeToLaunchTemplateVersion = {
    'primordial': '4',
    'sevtech': '5',
    'me5': '1'
}

const startmc = async (msg, serverMap) => {
    let channel = msg.channel;
    let lt = serverTypeToLaunchTemplateId[serverMap];
    let ltversion = serverTypeToLaunchTemplateVersion[serverMap];

    var params = {
        SpotFleetRequestConfig: {
            IamFleetRole: "arn:aws:iam::523775743690:role/aws-ec2-spot-fleet-tagging-role",
            AllocationStrategy: "capacityOptimized",
            TargetCapacity: 1,
            Type: "request",
            LaunchTemplateConfigs: [
                {
                    LaunchTemplateSpecification: {
                        LaunchTemplateId: lt,
                        Version: ltversion
                    },
                    Overrides: [
                    {
                        InstanceType: "r5.large",
                        WeightedCapacity: 1,
                        SubnetId: "subnet-97c35ff0" // us-west-2b
                    }
                ]
                }
            ]
        }
    };
    
    try {
        var spotFleetRequestId;
        let data = await ec2.requestSpotFleet(params).promise();
        console.log(data);
        spotFleetRequestId = data.SpotFleetRequestId;
    } catch (err) {
        console.log(err, err.stack);
        channel.send('ERROR: ' + err);
        return;
    }
  
    // Send ack to channel that it is starting
    
    channel.send(`ACK, starting ${serverMap} server. SAVE THIS MESSAGE! The fleet request id is: ${spotFleetRequestId}`);
    
    // Wait until instance ip is available
    var describeInstanceParams = {
      Filters: [
          {
              Name: "tag:aws:ec2spot:fleet-request-id",
              Values: [
                  spotFleetRequestId
              ]
          }
      ]
    };
  
    var maxRetryCount = 5;
    var retry = 0;
    var instanceIp;
    var retryDelayInSeconds = 10;
    while (retry < maxRetryCount) {
        console.log("Polling for ip address. Attempt #" + retry);
        await sleep(retryDelayInSeconds * 1000);
        retry++;
        retryDelayInSeconds += 10;
        
        try {
            let data = await ec2.describeInstances(describeInstanceParams).promise();
            if (data.Reservations && data.Reservations[0] && data.Reservations[0].Instances) {
                instanceIp = data.Reservations[0].Instances[0].PublicIpAddress;
                console.log("Found instance ip: " + instanceIp);
                break;
            }
        } catch (err) {
            console.log(err, err.stack);
            channel.send('ERROR: ' + err);
            return;
        }
    }
  
    // send instance ip to chat
    channel.send('The ip address is: ' + instanceIp + ' -- please wait 5-10 minutes while the MC server initializes.');
  }

module.exports = class StartMcCommand extends commando.Command {
  constructor(client) {
    console.log("Registering Start Minecraft command...");
    super(client, {
      name: 'startmc',
      aliases: ['startmc'],
      group: 'dackchat',
      memberName: 'startmc',
      description: 'Starts the DACK minecraft server',
      examples: ['startmc [sevtech|primordial|me5]'],
      args: [
          {
              key: 'serverMap',
              label: 'server map',
              prompt: 'Which map do you want to start?',
              type: 'string',
              default: 'sevtech'
          }
      ]
    });
  }

  async run(msg, {serverMap}) {
    console.log("Bot detected startmc command from " + msg.author);
    return await startmc(msg, serverMap);
  }
}