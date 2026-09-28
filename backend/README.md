# HealthScale Backend

## Auto-Scaling Healthcare Monitoring Platform

The HealthScale backend is a Python Flask application that provides APIs for patient management, healthcare data, infrastructure monitoring, and communication with Amazon RDS MySQL and AWS services.

---

## 1. Backend Responsibilities

The backend is responsible for:

* Patient registration
* Patient ID generation
* Patient data storage
* Patient data retrieval
* Health monitoring APIs
* Infrastructure monitoring
* EC2 information
* Auto Scaling information
* CloudWatch metrics
* Database connectivity
* API error handling

---

## 2. Technology Stack

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| Python            | Backend programming        |
| Flask             | REST API framework         |
| MySQL Connector   | RDS MySQL connectivity     |
| boto3             | AWS API communication      |
| Flask-CORS        | Frontend/API communication |
| Amazon RDS MySQL  | Patient database           |
| Amazon EC2        | Application server         |
| Amazon CloudWatch | Infrastructure monitoring  |
| EC2 Auto Scaling  | Automatic scaling          |

---

## 3. AWS Region

```text
Region:
ap-south-1

Location:
Asia Pacific (Mumbai)
```

---

## 4. Backend Architecture

```text
                 Frontend
                    |
                    | HTTP/REST
                    v
              Flask Backend
                    |
        +-----------+-----------+
        |                       |
        v                       v
   RDS MySQL                 AWS APIs
        |                       |
        v              +--------+--------+
    Patient Data       |        |        |
                      EC2       ASG   CloudWatch
```

---

## 5. Project Structure

```text
backend/
│
├── app.py
├── requirements.txt
└── README.md
```

---

## 6. Requirements

Install:

* Python 3.x
* AWS CLI
* MySQL Connector
* Flask
* Flask-CORS
* boto3

---

## 7. Install Dependencies

Run:

```powershell
pip install flask flask-cors mysql-connector-python boto3
```

Or:

```powershell
pip install -r requirements.txt
```

---

## 8. AWS CLI Configuration

Configure AWS CLI:

```powershell
aws configure
```

Use the project region:

```text
ap-south-1
```

Verify:

```powershell
aws sts get-caller-identity
```

---

## 9. Database Configuration

HealthScale uses a dedicated RDS MySQL database.

```text
Database Engine:
MySQL

Database:
healthscale

Username:
admin

Port:
3306
```

RDS endpoint:

```text
healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com
```

Do not hard-code the database password in `app.py`.

---

## 10. Environment Variables

PowerShell:

```powershell
$env:DB_HOST="healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com"
$env:DB_USER="admin"
$env:DB_NAME="healthscale"
$env:DB_PASSWORD = Read-Host "Enter HealthScale RDS password"
```

Verify:

```powershell
Write-Host "DB_HOST = $env:DB_HOST"
Write-Host "DB_USER = $env:DB_USER"
Write-Host "DB_NAME = $env:DB_NAME"
Write-Host "DB_PASSWORD_SET = $([string]::IsNullOrWhiteSpace($env:DB_PASSWORD) -eq $false)"
```

Expected:

```text
DB_PASSWORD_SET = True
```

---

## 11. Database Connection

The application reads database configuration from environment variables.

Example:

```python
DB_HOST = os.environ.get("DB_HOST")
DB_USER = os.environ.get("DB_USER", "admin")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_NAME = os.environ.get("DB_NAME", "healthscale")
```

Database connection:

```python
mysql.connector.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME
)
```

---

## 12. Patient Database

The main patient table is:

```text
patients
```

Typical fields:

```text
patient_id
name
age
gender
emergency_type
contact
```

The `patient_id` is generated automatically by MySQL.

---

# 13. API Endpoints

## Health Check

```text
GET /health
```

Purpose:

Checks whether the Flask backend is running.

Example:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:5000/health" `
  -Method GET
```

Example response:

```json
{
  "server": "SERVER-NAME",
  "status": "healthy"
}
```

---

## Patient Registration

```text
POST /register
```

The endpoint supports both JSON requests and HTML form submissions.

Example:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:5000/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Test Patient","age":35,"gender":"Male","emergency_type":"General Checkup","contact":"9999999999"}'
```

Successful response:

```json
{
  "status": "success",
  "message": "Patient registered successfully",
  "patient_id": 1
}
```

---

## Infrastructure API

```text
GET /api/infrastructure
```

Purpose:

Provides AWS infrastructure information for the Admin Dashboard.

Possible information includes:

```text
EC2 instances
Instance status
Instance type
Availability Zone
Auto Scaling Group
Desired capacity
Minimum capacity
Maximum capacity
CloudWatch metrics
CPU utilization
```

---

# 14. Patient Registration Flow

```text
Doctor Dashboard
       |
       v
Add Patient
       |
       v
POST /register
       |
       v
Flask
       |
       v
Validate Data
       |
       v
RDS MySQL
       |
       v
INSERT INTO patients
       |
       v
Auto-generated Patient ID
       |
       v
JSON Response
       |
       v
Frontend
```

---

# 15. AWS Infrastructure Flow

```text
Admin Dashboard
       |
       v
GET /api/infrastructure
       |
       v
Flask Backend
       |
       +------------+
       |            |
       v            v
      boto3       CloudWatch
       |
   +---+---+
   |   |   |
  EC2 ASG  ALB
```

---

# 16. Start Backend

Navigate to:

```powershell
cd C:\Users\Anuj\Documents\Vivek\healthscale
```

Set environment variables:

```powershell
$env:DB_HOST="healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com"
$env:DB_USER="admin"
$env:DB_NAME="healthscale"
$env:DB_PASSWORD = Read-Host "Enter HealthScale RDS password"
```

Start Flask:

```powershell
python .\app.py
```

Expected:

```text
Running on http://127.0.0.1:5000
```

---

# 17. Verify Backend

Open another PowerShell window:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:5000/health" `
  -Method GET
```

---

# 18. Test RDS Connection

Run:

```powershell
python -c "import os,mysql.connector; c=mysql.connector.connect(host=os.environ['DB_HOST'],user=os.environ['DB_USER'],password=os.environ['DB_PASSWORD'],database=os.environ['DB_NAME'],connection_timeout=10); print('RDS CONNECTION SUCCESS'); c.close()"
```

Expected:

```text
RDS CONNECTION SUCCESS
```

---

# 19. Syntax Check

Before starting Flask:

```powershell
python -m py_compile .\app.py
```

If there is no output, the Python file passed the syntax check.

---

# 20. Security

Never commit:

```text
DB_PASSWORD
AWS Access Keys
AWS Secret Keys
```

Use environment variables or AWS Secrets Manager for production.

Recommended production architecture:

```text
Application
    |
    v
AWS Secrets Manager
    |
    v
RDS Credentials
```

---

# 21. Security Group

The RDS Security Group controls access to MySQL.

```text
MySQL
Port:
3306
```

For production, avoid allowing MySQL access from:

```text
0.0.0.0/0
```

Prefer application-server Security Group access.

---

# 22. Backend Error Handling

Errors are returned as JSON.

Example:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common errors:

### MySQL 1045

```text
Access denied for user
```

Check:

* DB username
* DB password
* Environment variables

### MySQL 2003

```text
Can't connect to MySQL server
```

Check:

* RDS status
* RDS endpoint
* Port 3306
* Security Group
* Network connectivity

### Column cannot be null

```text
Column 'name' cannot be null
```

Check the request body and required fields.

---

# 23. Auto Scaling

HealthScale uses an EC2 Auto Scaling Group.

Example configuration:

```text
Minimum:
2

Desired:
2

Maximum:
4
```

Target tracking:

```text
ASGAverageCPUUtilization

Target:
50%
```

Concept:

```text
Traffic increases
       |
       v
CPU increases
       |
       v
CloudWatch
       |
       v
Auto Scaling Policy
       |
       v
New EC2 Instance
```

---

# 24. Backend Production Architecture

```text
Internet
   |
   v
Application Load Balancer
   |
   +-------------+
   |             |
   v             v
 EC2           EC2
   |             |
   +------+------+
          |
          v
      Flask API
          |
          v
      RDS MySQL

CloudWatch
    |
    v
Auto Scaling
```

---

# 25. Future Backend Enhancements

Planned improvements:

* Authentication
* Role-based authorization
* Doctor API
* Admin API
* Patient search API
* Patient details API
* Patient health history API
* Vital-sign API
* Medical reports
* S3 document storage
* SNS health alerts
* CloudWatch alarms
* AWS Secrets Manager
* HTTPS
* API Gateway
* CI/CD
* Automated testing

---

## Backend Status

```text
Flask Backend       ✓
RDS MySQL           ✓
Patient Registration ✓
Patient ID          ✓
AWS Integration     ✓
Infrastructure API  ✓
Auto Scaling        ✓
CloudWatch          ✓
```

