# Software Requirements Specification (SRS-001)

**Document ID:** SRS-001
**Document Version:** 1.0
**Status:** Draft
**Project:** Smart Library System with AI Recommendations
**Prepared By:** Namrata Salunkhe
**Course:** B.Sc. Computer Science (Third Year)
**University:** University of Mumbai
**Date:** 01 August 2026

---

# Version History

| Version | Date        | Description          | Author           |
| ------- | ----------- | -------------------- | ---------------- |
| 1.0     | 01-Aug-2026 | Initial SRS Document | Namrata Salunkhe |

---

# 1. Introduction

## 1.1 Purpose

The purpose of this Software Requirements Specification (SRS) document is to define the functional and non-functional requirements of the **Smart Library System with AI Recommendations**.

This document acts as a reference for the development, testing, and maintenance of the system. It describes the expected behavior, features, constraints, and objectives of the application throughout the Software Development Life Cycle (SDLC).

---

## 1.2 Scope

The Smart Library System is a web-based application designed for college libraries to automate library operations and improve accessibility for students and library staff.

The system allows students to:

* Search available books.
* View book details.
* Reserve books online.
* Track borrowing history.
* View due dates and fines.
* Receive AI-powered book recommendations.

The system allows librarians to:

* Manage books and categories.
* Handle issue and return operations.
* Manage reservations.
* Calculate fines.
* Maintain library records.

Administrators can:

* Manage users.
* Monitor system activities.
* View reports.
* Configure system settings.

The application includes an AI recommendation module that suggests relevant books using content-based filtering and borrowing history analysis.

---

## 1.3 Intended Audience

This document is intended for:

* Project Guide
* Project Developers
* Testing Team
* Project Review Committee
* Future System Maintainers

---

## 1.4 Definitions and Acronyms

| Term           | Description                         |
| -------------- | ----------------------------------- |
| AI             | Artificial Intelligence             |
| SRS            | Software Requirements Specification |
| JWT            | JSON Web Token                      |
| API            | Application Programming Interface   |
| UI             | User Interface                      |
| Admin          | System Administrator                |
| Reservation    | Booking a book before issue         |
| Borrow History | Record of previously borrowed books |

---

## 1.5 References

The following references are considered while preparing this document:

* IEEE 830 Software Requirements Specification Guidelines
* ISO/IEC/IEEE 29148 Systems and Software Engineering Standards
* University of Mumbai B.Sc. Computer Science Project Guidelines
* Flask Documentation
* React Documentation
* MySQL Documentation
* Scikit-learn Documentation
# 2. Overall Description

## 2.1 Product Perspective

The Smart Library System with AI Recommendations is an independent web-based application designed to modernize the traditional library management process in educational institutions.

The system follows a three-tier architecture consisting of:

* **Frontend Layer:** User interface developed using React.js.
* **Backend Layer:** Application logic and REST APIs developed using Python Flask.
* **Database Layer:** Data storage and management using MySQL.

The application provides role-based access for students, librarians, and administrators. It integrates an AI recommendation module to provide personalized book suggestions based on user behavior and book characteristics.

---

## 2.2 Product Functions

The major functions of the system include:

### Student Functions

* User registration and authentication.
* Search books by title, author, category, or keywords.
* View book availability.
* Reserve available books.
* Cancel reservations.
* View issued books and due dates.
* View borrowing history.
* View fine details.
* Receive AI-generated book recommendations.

---

### Librarian Functions

* Secure librarian login.
* Add, update, and remove books.
* Manage book categories.
* Issue books to students.
* Process returned books.
* Approve or reject reservations.
* Calculate overdue fines.
* Monitor library activities.

---

### Administrator Functions

* Manage system users.
* Manage librarian accounts.
* View system reports.
* Monitor application activities.
* Configure system settings.

---

### AI Recommendation Functions

The AI module provides personalized book recommendations using:

* Book similarity analysis based on metadata.
* Student borrowing history.
* Category and subject preferences.

---

## 2.3 User Classes and Characteristics

### Student

Students are the primary users of the system. They use the application to discover books, reserve resources, and manage their borrowing activities.

Characteristics:

* Basic computer knowledge.
* Requires simple and intuitive interface.
* Uses the system mainly for searching and borrowing books.

---

### Librarian

Librarians manage daily library operations through the system.

Characteristics:

* Responsible for maintaining book records.
* Handles issue, return, and reservation activities.
* Requires access to management features.

---

### Administrator

Administrators manage overall system configuration and user management.

Characteristics:

* Requires complete system access.
* Responsible for maintaining security and settings.

---

## 2.4 Operating Environment

The system will operate in the following environment:

### Client Side

* Web Browser:

  * Google Chrome
  * Microsoft Edge
  * Mozilla Firefox

* Operating System:

  * Windows
  * Linux
  * macOS

---

### Server Side

* Backend Framework:

  * Python Flask

* Database:

  * MySQL 8.0

* Runtime:

  * Python 3.12

---

### Development Environment

* Visual Studio Code
* Git and GitHub
* MySQL Workbench

---

## 2.5 Design and Implementation Constraints

The system development is subject to the following constraints:

* The project is developed within the academic timeline.
* The system must use Python for backend development.
* MySQL must be used as the database.
* The AI recommendation model will be developed using available datasets and library transaction data.
* The application must follow secure authentication practices.
* The system should maintain proper documentation throughout development.

---

## 2.6 Assumptions and Dependencies

### Assumptions

* Users have access to an internet-enabled device.
* Library data is maintained accurately.
* Students and librarians have valid system accounts.
* Required book information is available in the database.

### Dependencies

The system depends on:

* Python Flask framework.
* React.js frontend framework.
* MySQL database server.
* AI libraries such as Pandas, NumPy, and Scikit-learn.
* Web browser availability.