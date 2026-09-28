import boto3

REGION = "ap-south-1"
ASG_NAME = "healthscale-asg"

autoscaling = boto3.client(
    "autoscaling",
    region_name=REGION
)


def get_asg_details():
    response = autoscaling.describe_auto_scaling_groups(
        AutoScalingGroupNames=[ASG_NAME]
    )

    groups = response.get("AutoScalingGroups", [])

    if not groups:
        return {
            "error": "Auto Scaling Group not found"
        }

    group = groups[0]

    instances = []

    for instance in group.get("Instances", []):
        instances.append({
            "instance_id": instance["InstanceId"],
            "health": instance["HealthStatus"],
            "lifecycle": instance["LifecycleState"]
        })

    return {
        "name": group["AutoScalingGroupName"],
        "min_capacity": group["MinSize"],
        "desired_capacity": group["DesiredCapacity"],
        "max_capacity": group["MaxSize"],
        "instances": instances
    }