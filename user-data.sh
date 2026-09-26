#!/bin/bash

dnf update -y
dnf install -y python3 python3-pip

mkdir -p /opt/healthscale

cat > /opt/healthscale/app.py <<'PYTHON'
from flask import Flask, request, jsonify
import mysql.connector
import os
import socket

app = Flask(__name__)

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
                padding: 40px;
            }

            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
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
                padding: 12px;
                cursor: pointer;
            }

            .server {
                margin-top: 20px;
                padding: 12px;
                background: #eef2ff;
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


@app.route("/health")
def health():

    return jsonify({
        "status": "healthy",
        "server": socket.gethostname()
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
PYTHON

cat > /opt/healthscale/requirements.txt <<'REQ'
Flask
mysql-connector-python
REQ

cd /opt/healthscale

pip3 install -r requirements.txt

echo "Waiting for RDS..."

until python3 -c "import mysql.connector; mysql.connector.connect(host='healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com', user='admin', password='YOUR_PASSWORD', database='healthscale')" 2>/dev/null
do
    echo "RDS not ready yet. Retrying in 10 seconds..."
    sleep 10
done

echo "RDS connection successful."

python3 - <<'PYTHON'
import mysql.connector

connection = mysql.connector.connect(
    host="healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com",
    user="admin",
    password="YOUR_PASSWORD",
    database="healthscale"
)

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    emergency_type VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

connection.commit()

cursor.close()
connection.close()

print("Patients table ready.")
PYTHON

chown -R ec2-user:ec2-user /opt/healthscale

cat > /etc/systemd/system/healthscale.service <<'SERVICE'
[Unit]
Description=HealthScale Patient Registration Application
After=network.target

[Service]
User=root
WorkingDirectory=/opt/healthscale
Environment="DB_HOST=healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com"
Environment="DB_USER=admin"
Environment="DB_PASSWORD=YOUR_PASSWORD"
Environment="DB_NAME=healthscale"
ExecStart=/usr/bin/python3 /opt/healthscale/app.py
Restart=always

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable healthscale
systemctl start healthscale