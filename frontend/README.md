# HealthScale Frontend

## Auto-Scaling Healthcare Monitoring Platform

The HealthScale frontend is a web-based healthcare dashboard designed for doctors and administrators.

The frontend provides two primary experiences:

1. **Doctor Dashboard** — patient and health management
2. **Admin Dashboard** — AWS infrastructure monitoring

---

# 1. Frontend Responsibilities

The frontend provides:

* Patient management
* Patient registration
* Patient search
* Patient profiles
* Health monitoring
* Medical information
* Health alerts
* Infrastructure monitoring
* EC2 monitoring
* Auto Scaling monitoring
* CloudWatch metrics
* Server status
* System activity

---

# 2. Technology Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| HTML5        | Page structure          |
| CSS3         | UI styling              |
| JavaScript   | Application logic       |
| Fetch API    | Backend communication   |
| Chart.js     | Data visualization      |
| Browser APIs | Client-side interaction |

---

# 3. Frontend Architecture

```text
                         HealthScale
                             |
              +--------------+--------------+
              |                             |
              v                             v
       Doctor Dashboard              Admin Dashboard
              |                             |
       +------+-------+             +-------+-------+
       |      |       |             |       |       |
       v      v       v             v       v       v
    Patients Vitals Alerts        EC2     ASG   CloudWatch
       |
       v
   Flask API
       |
       v
   RDS MySQL
```

---

# 4. Frontend Structure

Recommended structure:

```text
frontend/
│
├── index.html
├── dashboard.html
│
├── Pages/
│   ├── patients.html
│   ├── servers.html
│   ├── metrics.html
│   ├── autoscaling.html
│   ├── alerts.html
│   ├── activity.html
│   └── settings.html
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── patients.css
│
├── js/
│   ├── app.js
│   ├── dashboard.js
│   ├── patients.js
│   ├── monitoring.js
│   └── api.js
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

# 5. Dashboard Roles

## Doctor

The Doctor Dashboard is focused on:

```text
Patients
Health Information
Vitals
Medical Conditions
Medications
Allergies
Emergency Information
Health Alerts
Patient History
```

---

## Administrator

The Admin Dashboard is focused on:

```text
EC2
Load Balancer
Auto Scaling
CloudWatch
Servers
Infrastructure
Alerts
Activity
Settings
```

---

# 6. Doctor Dashboard

The Doctor Dashboard provides patient management functionality.

Main sections:

```text
Dashboard
Patients
Add Patient
Patient Profile
Health Monitoring
Alerts
History
```

---

# 7. Add Patient

The Add Patient interface opens a patient registration form.

Example fields:

```text
Patient Name
Age
Gender
Emergency Type
Contact
```

Additional healthcare fields can include:

```text
Blood Group
Address
Medical Conditions
Allergies
Medications
Emergency Contact
Notes
```

---

# 8. Patient Registration Flow

```text
Doctor Dashboard
       |
       v
Add Patient
       |
       v
Registration Form
       |
       v
Validate Form
       |
       v
POST /register
       |
       v
Flask Backend
       |
       v
RDS MySQL
       |
       v
Patient ID Generated
       |
       v
Response
       |
       v
Patient Profile
```

---

# 9. Backend API

The frontend communicates with the Flask backend.

Development API:

```text
http://127.0.0.1:5000
```

Health check:

```text
GET /health
```

Patient registration:

```text
POST /register
```

Infrastructure:

```text
GET /api/infrastructure
```

---

# 10. Example Patient Request

JavaScript:

```javascript
const response = await fetch(
    "http://127.0.0.1:5000/register",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Test Patient",
            age: 35,
            gender: "Male",
            emergency_type: "General Checkup",
            contact: "9999999999"
        })
    }
);

const result = await response.json();
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

# 11. Automatic Patient ID

The frontend does not manually create patient IDs.

The workflow is:

```text
Frontend
   |
   v
Patient Information
   |
   v
Backend
   |
   v
MySQL
   |
   v
AUTO_INCREMENT
   |
   v
Patient ID
```

Example:

```text
Patient ID: 1
Patient ID: 2
Patient ID: 3
Patient ID: 4
```

---

# 12. Patient Profile

A patient profile can display:

```text
Patient ID
Patient Name
Age
Gender
Blood Group
Contact
Emergency Contact
Address
Medical Conditions
Allergies
Medications
Health Status
```

---

# 13. Health Monitoring

The Doctor Dashboard can display patient vitals such as:

```text
Heart Rate
Blood Pressure
SpO₂
Temperature
Respiratory Rate
```

Example:

```text
Heart Rate       78 BPM
Blood Pressure   120/80
SpO₂             98%
Temperature      98.6°F
```

These values should be treated as demonstration data unless connected to a real medical device or clinical data source.

---

# 14. Health Status

Example statuses:

```text
Stable
Monitoring
Attention Required
Critical
```

The UI can visually communicate status using badges, icons, and alert cards.

---

# 15. Health Alerts

The dashboard can show:

```text
High Heart Rate
Low SpO₂
High Temperature
Abnormal Blood Pressure
Medication Reminder
Emergency Alert
```

Future versions can connect these alerts to:

```text
CloudWatch
SNS
Email
SMS
IoT
```

---

# 16. Admin Dashboard

The Admin Dashboard displays AWS infrastructure.

Example cards:

```text
EC2 Instances
CPU Utilization
Auto Scaling
Load Balancer
Server Health
AWS Region
Active Alerts
```

---

# 17. Infrastructure Monitoring

The frontend calls:

```text
GET /api/infrastructure
```

The backend retrieves AWS information and returns it to the frontend.

Flow:

```text
Admin Dashboard
       |
       v
JavaScript fetch()
       |
       v
Flask
       |
       v
boto3
       |
       +---- EC2
       |
       +---- Auto Scaling
       |
       +---- CloudWatch
       |
       v
JSON
       |
       v
Dashboard UI
```

---

# 18. Auto Scaling Display

The Admin Dashboard can show:

```text
Minimum Capacity
Desired Capacity
Maximum Capacity
Current Instances
CPU Target
```

Example:

```text
Minimum Capacity     2
Desired Capacity     2
Maximum Capacity     4
CPU Target           50%
Current Instances    2
```

---

# 19. Infrastructure Visualization

Example:

```text
                Internet
                    |
                    v
                   ALB
                    |
             +------+------+
             |             |
             v             v
           EC2 #1       EC2 #2
             |             |
             +------+------+
                    |
                    v
                Flask API
                    |
                    v
                 RDS MySQL
```

---

# 20. Monitoring Dashboard

The frontend can display:

```text
CPU Utilization
Request Count
Instance Count
Server Health
Auto Scaling State
```

Charts can be used for historical metrics.

---

# 21. Frontend Setup

Navigate to the frontend folder:

```powershell
cd C:\Users\Anuj\Documents\Vivek\healthscale-dashboard\frontend
```

Start a local web server:

```powershell
python -m http.server 5501
```

Open:

```text
http://localhost:5501/
```

---

# 22. Backend Requirement

The frontend requires the Flask backend to be running.

Backend:

```text
http://127.0.0.1:5000
```

Frontend:

```text
http://localhost:5501
```

Both should be running during development.

---

# 23. Frontend-to-Backend Flow

```text
Chrome
  |
  v
HealthScale Frontend
  |
  | fetch()
  v
Flask API :5000
  |
  +----------+
  |          |
  v          v
RDS       AWS APIs
           |
       +---+---+
       |   |   |
      EC2 ASG CloudWatch
```

---

# 24. Responsive Design

The frontend should support:

```text
Desktop
Laptop
Tablet
Mobile
```

Recommended responsive features:

* Collapsible sidebar
* Responsive cards
* Responsive tables
* Mobile patient forms
* Adaptive charts
* Touch-friendly buttons

---

# 25. UI Design

HealthScale uses a modern healthcare dashboard style.

Important UI elements:

```text
Sidebar
Top Navigation
Dashboard Cards
Patient Cards
Tables
Charts
Modal / Slide-over Forms
Status Badges
Alerts
Activity Feed
```

---

# 26. Patient Management UI

Example:

```text
Patients
--------------------------------------------

Search patients...

+------------------------------------------+
| Patient ID | Name | Age | Status | View |
+------------------------------------------+
| HS-0001    | Rahul | 42 | Stable | View |
| HS-0002    | Amit  | 35 | Monitor| View |
+------------------------------------------+

              [+ Add Patient]
```

---

# 27. Add Patient UI

Recommended interaction:

```text
Click Add Patient
        |
        v
Slide-over Form
        |
        v
Enter Patient Information
        |
        v
Submit
        |
        v
Loading Animation
        |
        v
Backend API
        |
        v
Success
        |
        v
Patient ID Displayed
```

---

# 28. Error Handling

Frontend should handle API errors gracefully.

Example:

```javascript
if (!response.ok) {
    throw new Error("Unable to register patient");
}
```

Display:

```text
Unable to register patient.
Please try again.
```

Avoid exposing database credentials or internal server details to users.

---

# 29. Loading States

During API requests, display:

```text
Saving patient...
```

After success:

```text
Patient registered successfully.
Patient ID: HS-0001
```

---

# 30. Frontend Security

Never store:

```text
AWS Secret Key
AWS Access Key
RDS Password
Database credentials
```

inside:

```text
HTML
JavaScript
CSS
```

The frontend should communicate with the backend instead.

---

# 31. Production Frontend Architecture

A production deployment can use:

```text
User
 |
 v
CloudFront
 |
 v
S3 Static Website
 |
 v
Application Load Balancer
 |
 v
Flask Backend
 |
 +----------+
 |          |
 v          v
RDS       AWS APIs
```

For a production environment, HTTPS and appropriate authentication/authorization should be enabled.

---

# 32. Future Frontend Enhancements

Possible improvements:

* Login page
* Doctor authentication
* Admin authentication
* Role-based navigation
* Patient search
* Patient filtering
* Patient health history
* Real-time charts
* Medical report upload
* Appointment management
* Prescription management
* Notifications
* Dark/light theme
* Mobile application
* Real-time WebSocket updates

---

# 33. Frontend Status

```text
Admin Dashboard       ✓
Doctor Dashboard      ✓
Patient Registration  ✓
Patient ID Display    ✓
Patient UI            ✓
Health Monitoring UI  ✓
Infrastructure UI     ✓
Auto Scaling UI       ✓
CloudWatch UI         ✓
Responsive UI         ✓
```

---

# 34. Overall Frontend Workflow

```text
                    HealthScale
                        |
             +----------+----------+
             |                     |
             v                     v
       Doctor Dashboard      Admin Dashboard
             |                     |
             v                     v
         Patients             Infrastructure
             |                     |
             v                     v
       Patient Form          EC2 / ALB / ASG
             |                     |
             v                     v
       Flask Backend          AWS APIs
             |                     |
             v                     v
        RDS MySQL             CloudWatch
```

---

## Frontend Conclusion

The HealthScale frontend provides a role-oriented interface for healthcare operations and cloud infrastructure monitoring.

The Doctor Dashboard focuses on patients and health information, while the Admin Dashboard focuses on AWS infrastructure, scalability, and monitoring.

The frontend communicates with the Flask backend through REST APIs, keeping database credentials and AWS credentials outside the browser.
