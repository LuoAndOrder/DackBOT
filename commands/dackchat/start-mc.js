const AWS = require('aws-sdk');
const commando = require('discord.js-commando');
const discord = require('discord.js');

AWS.config.update({region: 'us-west-2'});

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

const startmc = async (msg) => {

  var params = {
      InstanceCount: 1,
      LaunchTemplateConfigs: [
          {
              LaunchTemplateSpecification: {
                  LaunchTemplateId: "lt-0598a4ccd43dbadf1",
                  Version: "3"
              },
              Overrides: [
                {
                    InstanceType: "m5d.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "m5d.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "m5d.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "m5d.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                },
                {
                    InstanceType: "m5dn.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "m5dn.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "m5dn.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "m5dn.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                },
                {
                    InstanceType: "m5ad.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "m5ad.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "m5ad.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "m5ad.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                },
                {
                    InstanceType: "r4.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "r4.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "r4.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "r4.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                },
                {
                    InstanceType: "m5n.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "m5n.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "m5n.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "m5n.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                },
                {
                    InstanceType: "c5a.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-34ec5a7d"
                },
                {
                    InstanceType: "c5a.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-97c35ff0"
                },
                {
                    InstanceType: "c5a.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-28a5ae70"
                },
                {
                    InstanceType: "c5a.large",
                    WeightedCapacity: 1,
                    SubnetId: "subnet-2bb24900"
                }
            ]
          }
      ]
  };

  var spotFleetRequestId;
  ec2.requestSpotFleet(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
          console.log(data);
          spotFleetRequestId = data.SpotFleetRequestId;
      }
  });

  // Send ack to channel that it is starting
  let channel = msg.channel;
  channel.send('ACK, startng server. The fleet request id is: ' + spotFleetRequestId);
  
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
  while (retry < maxRetryCount) {
      retry++;

      ec2.describeInstances(describeInstanceParams, function(err, data) {
          if (err) console.log(err, err.stack);
          else {
              if (data.Reservations[0] && data.reservations[0].Instances[0]) {
                  instanceIp = data.Reservations[0].Instances[0].PublicIpAddress;
                  console.log("Found instance ip: " + instanceIp);
              }
          }
      });

      if (instanceIp) break;
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
      examples: ['startmc']
    });
  }

  async run(msg, {url}) {
    console.log("Bot detected startmc command from " + msg.author);
    return await startmc(msg);
  }
}