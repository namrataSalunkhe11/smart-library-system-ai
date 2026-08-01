# Environment Setup

## Smart Library System with AI Recommendations

---

# 1. Introduction

## 1.1 Purpose

This document describes the setup requirements and configuration steps needed to run the Smart Library System in development and deployment environments.

It provides instructions for preparing software tools, databases, and application services.

---

# 2. System Requirements

## 2.1 Hardware Requirements

| Component | Minimum Requirement    |
| --------- | ---------------------- |
| Processor | Intel i5 or equivalent |
| RAM       | 8 GB                   |
| Storage   | 20 GB free space       |
| Network   | Internet connection    |

---

## 2.2 Software Requirements

| Software           | Purpose                 |
| ------------------ | ----------------------- |
| Operating System   | Windows/Linux           |
| Visual Studio Code | Development environment |
| Git                | Version control         |
| Python             | Backend development     |
| MySQL              | Database management     |
| Web Browser        | Application testing     |

---

# 3. Development Tools Setup

## Install Git

Steps:

1. Download and install Git.
2. Configure username and email.
3. Clone project repository.

Verify installation:

```bash id="s8m4q2"
git --version
```

---

## Install Python

Steps:

1. Install Python runtime.
2. Verify installation.

Command:

```bash id="m7n3x8"
python --version
```

---

## Install Database Server

Steps:

1. Install MySQL Server.
2. Create database instance.
3. Configure database user credentials.

Verify connection:

```sql id="q5p9m3"
SHOW DATABASES;
```

---

# 4. Repository Setup

Clone the project:

```bash id="x4n8m6"
git clone <repository-url>
```

Navigate into project directory:

```bash id="v8m2q5"
cd smart-library-system-ai
```

Install required dependencies:

```bash id="k3p7n9"
pip install -r requirements.txt
```
# 5. Backend Configuration

## 5.1 Backend Environment Setup

Steps:

1. Navigate to backend project directory.
2. Create a virtual environment.
3. Activate the environment.
4. Install required packages.

Example:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 5.2 Backend Configuration Variables

The backend requires configuration settings such as:

| Variable      | Purpose              |
| ------------- | -------------------- |
| DATABASE_URL  | Database connection  |
| SECRET_KEY    | Application security |
| JWT_SECRET    | Token generation     |
| AI_MODEL_PATH | AI model location    |

---

# 6. Database Configuration

## Database Setup Steps

1. Start MySQL server.
2. Create application database.
3. Configure database credentials.
4. Execute database schema scripts.
5. Verify database connection.

Example:

```sql
CREATE DATABASE smart_library;
```

---

## Database Verification

Check tables:

```sql
SHOW TABLES;
```

Verify required tables:

* Users
* Books
* Transactions
* Reservations
* Fines
* Recommendations

---

# 7. Frontend Setup

## Frontend Installation

Steps:

1. Navigate to frontend directory.
2. Install required packages.

Example:

```bash
npm install
```

---

## Frontend Configuration

Configure:

* Backend API URL
* Application settings
* Environment variables

Start frontend:

```bash
npm start
```

---

# 8. Application Verification

After setup, verify:

## Authentication

* User registration works.
* Login generates access token.

## Database

* Connection is successful.
* Data is stored correctly.

## APIs

* Endpoints respond correctly.
* Error handling works.

## AI Module

* Recommendations are generated successfully.

---

# 9. Setup Completion Checklist

| Task                      | Status    |
| ------------------------- | --------- |
| Install required software | Completed |
| Configure backend         | Completed |
| Setup database            | Completed |
| Configure frontend        | Completed |
| Verify application        | Completed |
