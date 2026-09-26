from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
import socket
import boto3

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5501"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5501", "http://127.0.0.1:5501"]}})

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


@app.route("/")
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>HealthScale</title>
        <style>
            body {
                font-family: Arial;
                background: #f4f7fb;
                margin: 0;
                padding: 40px;
            }

            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            h1 {
                color: #1f2937;
            }

            input, select, button {
                width: 100%;
                padding: 12px;
                margin: 8px 0 15px;
                box-sizing: border-box;
            }

            button {
                background: #2563eb;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 6px;
            }

            .server {
                margin-top: 20px;
                padding: 12px;
                background: #eef2ff;
                border-radius: 6px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>🏥 HealthScale</h1>
            <p>Emergency Patient Registration System</p>

            <form method="POST" action="/register">

                <label>Patient Name</label>
                <input type="text" name="name" required>

                <label>Age</label>
                <input type="number" name="age" required>

                <label>Gender</label>
                <select name="gender" required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>

                <label>Emergency Type</label>
                <input type="text" name="emergency" required>

                <label>Contact Number</label>
                <input type="text" name="contact" required>

                <button type="submit">
                    Register Patient
                </button>

            </form>

            <div class="server">
                <strong>Server:</strong> """ + socket.gethostname() + """
            </div>
        </div>
    </body>
    </html>
    """



@app.route("/register", methods=["POST"])
def register_patient():

    try:
        name = request.form.get("name")
        age = request.form.get("age")
        gender = request.form.get("gender")
        emergency = request.form.get("emergency")
        contact = request.form.get("contact")

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

        return f"""
        <html>
        <body style="font-family:Arial;text-align:center;padding:50px;">
            <h1>✅ Patient Registered</h1>
            <p>Patient ID: <strong>{patient_id}</strong></p>
            <p>Server: <strong>{socket.gethostname()}</strong></p>
            <br>
            <a href="/">Register Another Patient</a>
        </body>
        </html>
        """

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route("/api/infrastructure")
def infrastructure():
    try:
        # Get Auto Scaling Group information
        asg_response = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=[ASG_NAME]
        )

        groups = asg_response.get("AutoScalingGroups", [])

        if not groups:
            return jsonify({
                "status": "error",
                "message": "Auto Scaling Group not found"
            }), 404

        asg = groups[0]

        instance_ids = [
            instance["InstanceId"]
            for instance in asg.get("Instances", [])
        ]

        # Get EC2 instance information
        instances = []

        if instance_ids:
            ec2_response = ec2.describe_instances(
                InstanceIds=instance_ids
            )

            for reservation in ec2_response.get("Reservations", []):
                for instance in reservation.get("Instances", []):
                    instances.append({
                        "instance_id": instance["InstanceId"],
                        "state": instance["State"]["Name"],
                        "instance_type": instance["InstanceType"],
                        "private_ip": instance.get("PrivateIpAddress", ""),
                        "public_ip": instance.get("PublicIpAddress", ""),
                        "availability_zone": instance["Placement"]["AvailabilityZone"]
                    })

        # Get current CPU metrics from CloudWatch
        cpu_values = []

        for instance_id in instance_ids:
            metric = cloudwatch.get_metric_statistics(
                Namespace="AWS/EC2",
                MetricName="CPUUtilization",
                Dimensions=[
                    {
                        "Name": "InstanceId",
                        "Value": instance_id
                    }
                ],
                StartTime=__import__("datetime").datetime.now(
                    __import__("datetime").timezone.utc
                ) - __import__("datetime").timedelta(minutes=10),
                EndTime=__import__("datetime").datetime.now(
                    __import__("datetime").timezone.utc
                ),
                Period=300,
                Statistics=["Average"]
            )

            datapoints = metric.get("Datapoints", [])

            if datapoints:
                latest = sorted(
                    datapoints,
                    key=lambda x: x["Timestamp"],
                    reverse=True
                )[0]

                cpu_values.append(latest["Average"])

        average_cpu = (
            sum(cpu_values) / len(cpu_values)
            if cpu_values
            else 0
        )

        return jsonify({
            "status": "success",

            "autoscaling": {
                "name": asg["AutoScalingGroupName"],
                "min_capacity": asg["MinSize"],
                "desired_capacity": asg["DesiredCapacity"],
                "max_capacity": asg["MaxSize"],
                "instances": len(instance_ids)
            },

            "instances": instances,

            "metrics": {
                "average_cpu": round(average_cpu, 2),
                "instance_count": len(instance_ids)
            },

            "region": AWS_REGION
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "server": socket.gethostname()
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)