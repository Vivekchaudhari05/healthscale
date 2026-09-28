# 🏥 HealthScale – Auto-Scaling Healthcare Monitoring Platform

**HealthScale** is a cloud-based healthcare monitoring platform designed to manage patient information, monitor health conditions, and provide a scalable infrastructure for healthcare applications.

The project combines an interactive **👨‍⚕️ Doctor Dashboard** with an **🛠️ Admin Infrastructure Dashboard** and uses **☁️ AWS services** to provide high availability, load balancing, monitoring, and automatic scaling.

---

## 🎯 1. Project Overview

### 📌 Project Name

**HealthScale – Auto-Scaling Healthcare Monitoring Platform**

### 🎯 Objective

The main objective of HealthScale is to build a healthcare monitoring platform that can:

* 👤 Manage patient information
* 🆔 Generate unique patient IDs
* 📋 Display patient profiles
* ❤️ Monitor patient health information
* 🚨 Display medical alerts
* 🗄️ Store patient records in MySQL
* ⚖️ Distribute application traffic using an Application Load Balancer
* 🔄 Automatically scale EC2 instances according to CPU utilization
* 📊 Monitor infrastructure using Amazon CloudWatch
* 👨‍⚕️ Provide separate Doctor and Admin dashboards
* ☁️ Demonstrate AWS cloud scalability and high availability

---

## 👨‍⚕️ 2. Key Features

### 🩺 Doctor Dashboard

The Doctor Dashboard focuses on patient and healthcare operations.

Features include:

* ➕ Patient registration
* 🆔 Automatic patient ID generation
* 🔎 Patient search
* 👥 Patient list
* 👤 Patient profile
* 🎂 Patient age calculation
* ⚧️ Gender information
* 🩸 Blood group
* 📞 Contact information
* 🚑 Emergency contact
* 📍 Address
* 🏥 Medical conditions
* 💊 Current medications
* ⚠️ Allergies
* 📝 Medical notes
* ❤️ Health status
* 💓 Heart-rate monitoring
* 🩺 Blood-pressure monitoring
* 🫁 SpO₂ monitoring
* 🌡️ Temperature monitoring
* 📈 Patient health history
* 🚨 Health alerts
* 📊 Patient statistics

---

## 🛠️ Admin Dashboard

The Admin Dashboard focuses on AWS infrastructure and application operations.

Features include:

* 🖥️ EC2 instance monitoring
* 🔄 Auto Scaling Group monitoring
* ⚖️ Application Load Balancer monitoring
* 📊 CloudWatch metrics
* 🧮 CPU utilization
* 📡 Request monitoring
* 🚨 Active infrastructure alerts
* 🖥️ Server status
* ⚙️ Auto Scaling configuration
* 🕒 Recent activity
* ⚙️ System configuration
* 🌏 AWS region information

---

## 🏗️ 3. AWS Architecture

```text
                         🌐 Internet
                              |
                              v
                    +----------------+
                    |      ⚖️ ALB     |
                    |  Application   |
                    | Load Balancer  |
                    +-------+--------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
       +-------------+             +-------------+
       |   🖥️ EC2 #1 |             |   🖥️ EC2 #2 |
       | HealthScale |             | HealthScale |
       +------+------+             +------+------+
              |                           |
              +-------------+-------------+
                            |
                            v
                    +---------------+
                    | 🔄 Auto Scaling|
                    |     Group      |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | 📊 CloudWatch |
                    | Monitoring &  |
                    |    Metrics    |
                    +---------------+


👨‍⚕️ Doctor Dashboard
       |
       v
    🔌 Flask API
       |
       v
+----------------------+
| 🗄️ Amazon RDS MySQL |
| healthscale database |
+----------------------+
       |
       v
 👥 Patient Records
```

---

## ☁️ 4. AWS Services Used

| AWS Service                  | Purpose                                |
| ---------------------------- | -------------------------------------- |
| 🖥️ Amazon EC2               | Runs HealthScale application servers   |
| ⚖️ Application Load Balancer | Distributes incoming traffic           |
| 🔄 EC2 Auto Scaling          | Automatically adjusts EC2 capacity     |
| 📊 Amazon CloudWatch         | Collects infrastructure metrics        |
| 🗄️ Amazon RDS MySQL         | Stores patient information             |
| 🌐 Amazon VPC                | Provides network infrastructure        |
| 🔐 Security Groups           | Controls network access                |
| 👤 IAM                       | Controls AWS permissions               |
| 💻 AWS CLI                   | Used for AWS infrastructure management |

---

## ⚙️ 5. Auto Scaling Configuration

HealthScale uses an **EC2 Auto Scaling Group**.

### 🔄 Auto Scaling Group

```text
Name: healthscale-asg
🌏 Region: ap-south-1
Minimum Capacity: 2
Desired Capacity: 2
Maximum Capacity: 4
```

### 📊 Scaling Policy

The project uses **Target Tracking Scaling**.

```text
Metric:
ASGAverageCPUUtilization

Target:
50%
```

The basic behavior is:

```text
📉 Low CPU
   |
   v
🖥️ 2 EC2 instances
   |
   |
📈 High traffic
   |
   v
🔥 CPU increases
   |
   v
📊 CloudWatch
   |
   v
⚙️ Auto Scaling Policy
   |
   v
➕ Additional EC2 instance
```

This allows the application to handle increased traffic automatically.

---

## ⚖️ 6. Load Balancing

The **Application Load Balancer** distributes incoming requests across healthy EC2 instances.

```text
                    ⚖️ ALB
                     |
             +-------+-------+
             |               |
             v               v
          🖥️ EC2 #1       🖥️ EC2 #2
             |               |
             +-------+-------+
                     |
                🏥 Application
```

---

## 🗄️ 7. Database

HealthScale uses a separate **Amazon RDS MySQL** database.

### 🗄️ Database

```text
Database Engine: MySQL
Database Name: healthscale
Username: admin
Port: 3306
🌏 Region: ap-south-1
```

The application stores patient information in the `patients` table.

---

## 🔌 8. Patient Registration Flow

The patient registration workflow is:

```text
👨‍⚕️ Doctor Dashboard
       |
       v
➕ Add Patient Form
       |
       v
🔌 Flask REST API
       |
       v
✅ Validate Patient Data
       |
       v
🗄️ MySQL RDS
       |
       v
🆔 Generate Patient ID
       |
       v
📤 Return Registration Result
       |
       v
👤 Display Patient in Dashboard
```

---

## 💻 9. Backend

The backend is developed using **Python Flask**.

### 📁 Backend

```text
healthscale/
└── app.py
```

### 🌐 Backend URL

```text
http://127.0.0.1:5000
```

### ❤️ Health Check

```text
GET /health
```

---

## 🔌 10. API Endpoints

### ❤️ Health Check

```text
GET /health
```

Used to verify that the backend is running.

### 👤 Patient Registration

```text
POST /register
```

### 🖥️ Infrastructure API

```text
GET /api/infrastructure
```

This endpoint provides infrastructure information such as:

* 🔄 Auto Scaling Group
* 🖥️ EC2 instances
* 🟢 Instance state
* 💻 Instance type
* 🌐 Availability Zone
* 🔒 Private IP
* 🌍 Public IP
* 📊 Average CPU
* 🔢 Instance count
* 🌏 AWS region

---

## 🎨 11. Frontend Architecture

The frontend is built using:

* 🌐 HTML5
* 🎨 CSS3
* ⚡ JavaScript

The frontend contains two major dashboard areas.

```text
🎨 Frontend
│
├── 🛠️ Admin Dashboard
│   ├── 🏗️ Infrastructure
│   ├── 🖥️ Servers
│   ├── 📊 Metrics
│   ├── 🔄 Auto Scaling
│   ├── 🚨 Alerts
│   ├── 🕒 Activity
│   └── ⚙️ Settings
│
└── 👨‍⚕️ Doctor Dashboard
    ├── 👥 Patients
    ├── ➕ Add Patient
    ├── 👤 Patient Profile
    ├── ❤️ Vital Monitoring
    ├── 🚨 Health Alerts
    └── 📜 Patient History
```

---

## 📁 12. Project Structure

```text
healthscale/
│
├── ⚙️ .github/
├── 💻 backend/
├── 🎨 frontend/
├── 📚 docs/
├── 🏗️ infrastructure/
├── 📜 scripts/
├── 🧪 tests/
└── 📄 README.md
```

---

## 👨‍💻 13. Local Development

### 📋 Requirements

* 🐍 Python
* 🌶️ Flask
* 🔗 Flask-CORS
* 🗄️ MySQL Connector
* ☁️ boto3
* 💻 AWS CLI
* 🌐 Google Chrome

---

## 🔐 14. Configure AWS CLI

```bash
aws configure
```

Use:

```text
🌏 Region:
ap-south-1
```

---

## 🗄️ 15. Configure Database Environment Variables

Windows PowerShell:

```powershell
$env:DB_HOST="healthscale-db.cdcoquukssuo.ap-south-1.rds.amazonaws.com"
$env:DB_USER="admin"
$env:DB_NAME="healthscale"
$env:DB_PASSWORD = Read-Host "Enter HealthScale RDS password"
```

🔐 **Never commit the database password to GitHub.**

---

## 🚀 16. Start Backend

```powershell
cd C:\Users\Anuj\Documents\Vivek\healthscale
python .\app.py
```

Backend:

```text
🌐 http://127.0.0.1:5000
```

---

## 🎨 17. Start Frontend

```powershell
cd C:\Users\Anuj\Documents\Vivek\healthscale-dashboard\frontend
python -m http.server 5501
```

Open:

```text
🌐 http://localhost:5501/
```

Admin Dashboard:

```text
🛠️ http://localhost:5501/dashboard.html
```

Doctor patient management:

```text
👨‍⚕️ http://localhost:5501/Pages/patients.html
```

---

## 📊 18. Monitoring

CloudWatch is used to monitor infrastructure.

Important metrics include:

* 🔥 EC2 CPU utilization
* 🔄 Auto Scaling instance count
* 📡 ALB request count
* ❤️ Application health
* 🖥️ Instance state

---

## 🔐 19. Security

Security considerations include:

* 🔐 RDS access controlled through Security Groups
* 🔒 MySQL port 3306 restricted to authorized sources
* 👤 AWS IAM permissions
* 🚫 No passwords stored in source code
* 🔑 Environment variables used for sensitive configuration
* ⚖️ ALB used as the application entry point
* 🌐 Private networking can be used for production deployments

---

## 🚀 20. High Availability

HealthScale uses multiple EC2 instances.

```text
                 ⚖️ ALB
                  |
        +---------+---------+
        |                   |
      🖥️ EC2 #1           🖥️ EC2 #2
        |                   |
        +---------+---------+
                  |
               🗄️ RDS
```

---

## 📈 21. Scalability

HealthScale is designed to scale automatically.

### 🟢 Normal Traffic

```text
2 EC2 instances
```

### 🔥 Increased Traffic

```text
📈 CPU utilization increases
        |
        v
📊 CloudWatch
        |
        v
🔄 Auto Scaling
        |
        v
➕ New EC2 instance
```

### 🚀 Maximum Configured Capacity

```text
4 EC2 instances
```

---

## 🧪 22. Testing

The project can be tested at multiple levels.

### 💻 Backend

```bash
python -m py_compile app.py
```

### ❤️ Health Check

```text
GET /health
```

### 👤 Patient Registration

```text
POST /register
```

### 🏗️ Infrastructure

```text
GET /api/infrastructure
```

### ☁️ AWS

Verify:

* 🖥️ EC2 instances
* 🎯 Target group
* ⚖️ ALB
* 🔄 Auto Scaling Group
* 📊 CloudWatch metrics
* 🗄️ RDS status

---

## 🔄 23. Example Project Workflow

```text
1️⃣ User opens HealthScale
          |
          v
2️⃣ Doctor opens Doctor Dashboard
          |
          v
3️⃣ Doctor selects Add Patient
          |
          v
4️⃣ Patient information is entered
          |
          v
5️⃣ Frontend sends request to Flask API
          |
          v
6️⃣ Flask validates request
          |
          v
7️⃣ Flask connects to RDS MySQL
          |
          v
8️⃣ Patient record is inserted
          |
          v
9️⃣ MySQL generates Patient ID
          |
          v
🔟 Patient profile is displayed
          |
          v
1️⃣1️⃣ Doctor monitors patient information
          |
          v
1️⃣2️⃣ AWS infrastructure handles application traffic
          |
          v
1️⃣3️⃣ CloudWatch monitors infrastructure
          |
          v
1️⃣4️⃣ Auto Scaling adjusts EC2 capacity
```

---

## 👨‍⚕️ 24. Admin vs Doctor Dashboard

### 👨‍⚕️ Doctor Dashboard

Designed for healthcare staff.

Focus:

```text
👥 Patients
❤️ Health
💓 Vitals
🏥 Medical Information
🚨 Alerts
📜 History
```

### 🛠️ Admin Dashboard

Designed for system administrators.

Focus:

```text
🖥️ EC2
⚖️ ALB
🔄 Auto Scaling
📊 CloudWatch
🖥️ Servers
🏗️ Infrastructure
🚨 System Alerts
🕒 Activity
⚙️ Settings
```

---

## 🔮 25. Future Enhancements

Potential future features include:

* 🔐 Amazon Cognito authentication
* 👥 Role-based access control
* 👨‍⚕️ Doctor accounts
* 🛠️ Admin accounts
* 👩‍⚕️ Nurse accounts
* ❤️ Real-time patient vitals
* 📡 AWS IoT integration
* ⌚ Wearable device integration
* 🔔 Amazon SNS health alerts
* 📧 Email/SMS notifications
* 📜 Patient medical history
* 📅 Appointment management
* 💊 Prescription management
* 📄 Medical report uploads
* 🗂️ S3 document storage
* 🌐 CloudFront CDN
* 🔒 HTTPS using ACM
* 🌍 Route 53 domain
* 🔄 CI/CD using GitHub Actions
* 📦 ECS/EKS deployment
* 🗄️ RDS Multi-AZ
* 🔑 Secrets Manager
* 🛡️ AWS WAF
* 📋 CloudTrail auditing

---

## 🏆 26. Project Benefits

HealthScale demonstrates several important cloud computing concepts:

* ☁️ Cloud computing
* 🖥️ AWS EC2
* ⚖️ Load balancing
* ↔️ Horizontal scaling
* 🔄 Auto Scaling
* 📊 CloudWatch monitoring
* 🗄️ RDS database management
* 🌐 VPC networking
* 🔐 Security Groups
* 🔌 REST APIs
* 🐍 Python Flask
* 🌐 HTML/CSS/JavaScript
* 🗃️ Database integration
* 🏗️ Infrastructure monitoring
* 🟢 High availability

---

## 🛠️ 27. Technologies Used

### 🎨 Frontend

```text
HTML5
CSS3
JavaScript
```

### 💻 Backend

```text
Python
Flask
Flask-CORS
boto3
MySQL Connector
```

### 🗄️ Database

```text
Amazon RDS
MySQL
```

### ☁️ Cloud

```text
Amazon EC2
Application Load Balancer
EC2 Auto Scaling
Amazon CloudWatch
Amazon VPC
IAM
AWS CLI
```

---

## 🌏 28. AWS Region

The project is deployed/configured for:

```text
🌏 AWS Region:
Asia Pacific (Mumbai)

📍 Region Code:
ap-south-1
```

---

## 🎤 29. Project Objective for Presentation

> **HealthScale is an auto-scaling healthcare monitoring platform built using AWS. It provides separate Doctor and Admin dashboards. Doctors can manage patients and monitor health information, while administrators can monitor the underlying AWS infrastructure. The application uses EC2 instances behind an Application Load Balancer, an Auto Scaling Group to automatically adjust server capacity, CloudWatch for monitoring, and Amazon RDS MySQL for patient data storage. The project demonstrates how a healthcare application can be designed for scalability, availability, monitoring, and cloud-based database management.**

---

## ✅ 30. Conclusion

HealthScale demonstrates how AWS cloud services can be combined to build a scalable healthcare application.

The application separates healthcare operations from infrastructure administration while providing:

```text
👥 Patient Management
        +
❤️ Health Monitoring
        +
🗄️ RDS Database
        +
⚖️ Application Load Balancer
        +
🖥️ EC2
        +
🔄 Auto Scaling
        +
📊 CloudWatch
        =
🏥 Scalable Healthcare Platform
```

The project can be further extended with authentication, real-time IoT health monitoring, automated alerts, secure document storage, CI/CD, and production-grade AWS security.

---

## 👨‍💻 Author

**HealthScale – Auto-Scaling Healthcare Monitoring Platform**

☁️ Built as an AWS cloud computing project demonstrating scalable healthcare application architecture.
