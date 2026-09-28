import boto3
from datetime import datetime, timedelta, timezone


REGION = "ap-south-1"

LOAD_BALANCER = "app/healthscale-alb/82ae8a9225d4980e"


cloudwatch = boto3.client(
    "cloudwatch",
    region_name=REGION
)


def get_request_count():

    end_time = datetime.now(timezone.utc)

    start_time = (
        end_time -
        timedelta(hours=2)
    )


    response = cloudwatch.get_metric_statistics(

        Namespace="AWS/ApplicationELB",

        MetricName="RequestCount",

        Dimensions=[
            {
                "Name": "LoadBalancer",
                "Value": LOAD_BALANCER
            }
        ],

        StartTime=start_time,

        EndTime=end_time,

        Period=300,

        Statistics=["Sum"]

    )


    datapoints = response.get(
        "Datapoints",
        []
    )


    datapoints.sort(
        key=lambda item:
        item["Timestamp"]
    )


    return [

        {
            "timestamp":
                point["Timestamp"].isoformat(),

            "requests":
                int(point["Sum"])

        }

        for point in datapoints

    ]