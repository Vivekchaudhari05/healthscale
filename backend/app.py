from flask import Flask, request, jsonify
from flask_cors import CORS

import mysql.connector
import os
import socket
import boto3
from datetime import datetime, timezone, timedelta


# =========================================================
# FLASK APPLICATION
# =========================================================

app = Flask(__name__)


# =========================================================
# CORS CONFIGURATION
# =========================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5501",
                "http://127.0.0.1:5501"
            ]
        }
    }
)


# =========================================================
# AWS CONFIGURATION
# =========================================================

AWS_REGION = "ap-south-1"

ASG_NAME = "healthscale-asg"
ALB_NAME = "healthscale-alb"


autoscaling = boto3.client(
    "autoscaling",
    region_name=AWS_REGION
)

ec2 = boto3.client(
    "ec2",
    region_name=AWS_REGION
)

cloudwatch = boto3.client(
    "cloudwatch",
    region_name=AWS_REGION
)

elbv2 = boto3.client(
    "elbv2",
    region_name=AWS_REGION
)


# =========================================================
# DATABASE CONFIGURATION
# =========================================================

DB_HOST = os.environ.get("DB_HOST")
DB_USER = os.environ.get("DB_USER", "admin")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_NAME = os.environ.get("DB_NAME", "healthscale")


def get_db_connection():

    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():

    hostname = socket.gethostname()

    return f"""
    <!DOCTYPE html>

    <html lang="en">

    <head>

        <meta charset="UTF-8">

        <meta name="viewport"
              content="width=device-width, initial-scale=1.0">

        <title>HealthScale</title>

        <style>

            body {{
                font-family: Arial, sans-serif;
                background: #f4f7fb;
                margin: 0;
                padding: 40px;
            }}

            .container {{
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow:
                    0 4px 15px rgba(0, 0, 0, 0.1);
            }}

            h1 {{
                color: #1f2937;
            }}

            input,
            select,
            button {{
                width: 100%;
                padding: 12px;
                margin: 8px 0 15px;
                box-sizing: border-box;
            }}

            button {{
                background: #2563eb;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 6px;
            }}

            button:hover {{
                background: #1d4ed8;
            }}

            .server {{
                margin-top: 20px;
                padding: 12px;
                background: #eef2ff;
                border-radius: 6px;
            }}

        </style>

    </head>

    <body>

        <div class="container">

            <h1>HealthScale</h1>

            <p>
                Emergency Patient Registration System
            </p>

            <form method="POST" action="/register">

                <label>Patient Name</label>

                <input
                    type="text"
                    name="name"
                    required
                >

                <label>Age</label>

                <input
                    type="number"
                    name="age"
                    min="0"
                    max="150"
                    required
                >

                <label>Gender</label>

                <select name="gender" required>

                    <option value="">
                        Select
                    </option>

                    <option value="Male">
                        Male
                    </option>

                    <option value="Female">
                        Female
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

                <label>Emergency Type</label>

                <input
                    type="text"
                    name="emergency"
                    required
                >

                <label>Contact Number</label>

                <input
                    type="text"
                    name="contact"
                    required
                >

                <button type="submit">
                    Register Patient
                </button>

            </form>

            <div class="server">

                <strong>Server:</strong>
                {hostname}

            </div>

        </div>

    </body>

    </html>
    """


# =========================================================
# PATIENT REGISTRATION
# =========================================================

@app.route("/register", methods=["POST"])
def register_patient():

    try:
        # Accept both JSON requests and HTML form submissions
        if request.is_json:
            data = request.get_json()
            name = data.get("name")
            age = data.get("age")
            gender = data.get("gender")
            emergency = data.get("emergency_type") or data.get("emergency")
            contact = data.get("contact")
        else:
            name = request.form.get("name")
            age = request.form.get("age")
            gender = request.form.get("gender")
            emergency = request.form.get("emergency_type") or request.form.get("emergency")
            contact = request.form.get("contact")

        # Basic validation
        if not name:
            return jsonify({
                "status": "error",
                "message": "Patient name is required"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO patients
            (name, age, gender, emergency_type, contact)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, age, gender, emergency, contact))

        connection.commit()

        patient_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return jsonify({
            "status": "success",
            "message": "Patient registered successfully",
            "patient_id": patient_id
        }), 201

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# =========================================================
# INFRASTRUCTURE API
# =========================================================

@app.route("/api/infrastructure", methods=["GET"])
def infrastructure():

    try:

        # =================================================
        # AUTO SCALING GROUP
        # =================================================

        asg_response = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=[
                ASG_NAME
            ]
        )


        groups = asg_response.get(
            "AutoScalingGroups",
            []
        )


        if not groups:

            return jsonify({
                "status": "error",
                "message": "Auto Scaling Group not found"
            }), 404


        asg = groups[0]


        # =================================================
        # GET INSTANCE IDS
        # =================================================

        instance_ids = [
            instance["InstanceId"]
            for instance in asg.get(
                "Instances",
                []
            )
        ]


        # =================================================
        # EC2 INSTANCES
        # =================================================

        instances = []


        if instance_ids:

            ec2_response = ec2.describe_instances(
                InstanceIds=instance_ids
            )


            for reservation in ec2_response.get(
                "Reservations",
                []
            ):

                for instance in reservation.get(
                    "Instances",
                    []
                ):

                    instances.append({

                        "instance_id":
                            instance["InstanceId"],

                        "state":
                            instance["State"]["Name"],

                        "instance_type":
                            instance["InstanceType"],

                        "private_ip":
                            instance.get(
                                "PrivateIpAddress",
                                ""
                            ),

                        "public_ip":
                            instance.get(
                                "PublicIpAddress",
                                ""
                            ),

                        "availability_zone":
                            instance["Placement"][
                                "AvailabilityZone"
                            ]

                    })


        # =================================================
        # CLOUDWATCH CPU METRICS
        # =================================================

        cpu_values = []


        for instance_id in instance_ids:

            end_time = datetime.now(
                timezone.utc
            )


            start_time = (
                end_time -
                timedelta(minutes=10)
            )


            metric = cloudwatch.get_metric_statistics(

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

                Statistics=[
                    "Average"
                ]

            )


            datapoints = metric.get(
                "Datapoints",
                []
            )


            if datapoints:

                latest = sorted(
                    datapoints,
                    key=lambda x: x["Timestamp"],
                    reverse=True
                )[0]


                cpu_values.append(
                    latest["Average"]
                )


        # =================================================
        # CALCULATE AVERAGE CPU
        # =================================================

        if cpu_values:

            average_cpu = (
                sum(cpu_values) /
                len(cpu_values)
            )

        else:

            average_cpu = 0


        # =================================================
        # API RESPONSE
        # =================================================

        return jsonify({

            "status": "success",

            "autoscaling": {

                "name":
                    asg["AutoScalingGroupName"],

                "min_capacity":
                    asg["MinSize"],

                "desired_capacity":
                    asg["DesiredCapacity"],

                "max_capacity":
                    asg["MaxSize"],

                "instances":
                    len(instance_ids)

            },

            "instances":
                instances,

            "metrics": {

                "average_cpu":
                    round(
                        average_cpu,
                        2
                    ),

                "instance_count":
                    len(instance_ids)

            },

            "region":
                AWS_REGION

        })


    except Exception as e:

        return jsonify({

            "status": "error",

            "message":
                str(e)

        }), 500


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({

        "status":
            "healthy",

        "server":
            socket.gethostname()

    })


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )