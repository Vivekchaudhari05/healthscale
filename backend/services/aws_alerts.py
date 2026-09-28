import boto3

REGION = "ap-south-1"

cloudwatch = boto3.client(
    "cloudwatch",
    region_name=REGION
)


def get_healthscale_alerts():

    response = cloudwatch.describe_alarms(
        AlarmNamePrefix="HealthScale-"
    )

    alarms = []

    for alarm in response.get("MetricAlarms", []):

        alarms.append({
            "name": alarm["AlarmName"],
            "state": alarm["StateValue"],
            "reason": alarm["StateReason"],
            "metric": alarm["MetricName"],
            "threshold": alarm["Threshold"],
            "comparison": alarm["ComparisonOperator"],
            "updated": alarm[
                "StateUpdatedTimestamp"
            ].isoformat()
        })

    return alarms