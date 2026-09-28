import boto3
from datetime import datetime, timedelta, timezone

REGION = "ap-south-1"

cloudwatch = boto3.client(
    "cloudwatch",
    region_name=REGION
)


def get_cpu_utilization(instance_id):
    end_time = datetime.now(timezone.utc)
    start_time = end_time - timedelta(minutes=30)

    response = cloudwatch.get_metric_statistics(
        Namespace="AWS/EC2",
        MetricName="CPUUtilization",
        Dimensions=[
            {
                "Name": "InstanceId",
                "Value": instance_id
            }
        ],
        StartTime=start_time,
        EndTime=end_time,
        Period=300,
        Statistics=["Average"]
    )

    datapoints = response.get("Datapoints", [])

    datapoints.sort(
        key=lambda item: item["Timestamp"]
    )

    return [
        {
            "timestamp": point["Timestamp"].isoformat(),
            "average": round(point["Average"], 2)
        }
        for point in datapoints
    ]