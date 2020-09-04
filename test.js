const AWS = require('aws-sdk');

AWS.config.update({region: 'us-west-2'});

var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
    SpotFleetRequestConfig: {
        IamFleetRole: "arn:aws:iam::523775743690:role/aws-ec2-spot-fleet-tagging-role",
        AllocationStrategy: "capacityOptimized",
        TargetCapacity: 1,
        Type: "request",
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
    }
};

// ec2.requestSpotFleet(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log(data);
// });

var describeParams = {
    SpotFleetRequestId: "sfr-3b23da5a-4a44-432d-ba6c-eb674e391ea5"
};
// ec2.describeSpotFleetInstances(describeParams, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log(data);
//     /*
//    data = {
//     ActiveInstances: [
//        {
//       InstanceId: "i-1234567890abcdef0", 
//       InstanceType: "m3.medium", 
//       SpotInstanceRequestId: "sir-08b93456"
//      }
//     ], 
//     SpotFleetRequestId: "sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE"
//    }
//    */
// })

const describeInstance = async () => {
var describeInstanceParams = {
    Filters: [
        {
            Name: "tag:aws:ec2spot:fleet-request-id",
            Values: [
                "sfr-3b23da5a-4a44-432d-ba6c-eb674e391ea5"
            ]
        }
    ]
    // InstanceIds: [
    //     "i-072dd102c9e082691"
    // ]
};
let data = await ec2.describeInstances(describeInstanceParams).promise();
return data.Reservations[0].Instances[0].PublicIpAddress;
}

var stopParams = {
    SpotFleetRequestIds: [
        "fillin"
    ],
    TerminateInstances: true
};

// ec2.cancelSpotFleetRequests(stopParams, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else console.log(data);
// })
describeInstance().then(result => console.log(result));