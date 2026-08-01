# Use Case Diagram

## Smart Library System with AI Recommendations

---

## 1. Introduction

The Use Case Diagram represents the interaction between different actors and the Smart Library System.

It identifies system users, external components, and the functionalities they can access.

---

# 2. System Actors

The system consists of four major actors:

| Actor                    | Description                                        |
| ------------------------ | -------------------------------------------------- |
| Student                  | Uses library services and receives recommendations |
| Librarian                | Manages daily library operations                   |
| Administrator            | Controls system management and reports             |
| AI Recommendation Engine | Generates personalized book suggestions            |

---

# 3. UML Use Case Diagram

```text
                         +--------------------------------+
                         |                                |
                         |     Smart Library System       |
                         |                                |
                         |                                |
 Administrator           |                                |
       |                 |                                |
       |---------------->| Manage User Accounts           |
       |                 |                                |
       |---------------->| Generate Reports               |
       |                 |                                |
       |                 |                                |
       |                 |                                |
 Student                 |                                |
       |                 |                                |
       |---------------->| Register / Login               |
       |                 |                                |
       |---------------->| Search Books                   |
       |                 |                                |
       |---------------->| Reserve Book                   |
       |                 |                                |
       |---------------->| View Borrowing History         |
       |                 |                                |
       |---------------->| View Fine Details              |
       |                 |                                |
       |---------------->| Get AI Recommendations         |
       |                 |                                |
       |                 |                                |
       |                 |                                |
 Librarian               |                                |
       |                 |                                |
       |---------------->| Manage Book Catalogue          |
       |                 |                                |
       |---------------->| Issue Book                     |
       |                 |                                |
       |---------------->| Return Book                    |
       |                 |                                |
       |---------------->| Manage Reservations            |
       |                 |                                |
       |---------------->| Manage Fine Records            |
       |                 |                                |
       |                 |                                |
 AI Recommendation       |                                |
 Engine                  |                                |
       |---------------->| Generate Recommendations       |
       |                 |                                |
                         +--------------------------------+

```

---

# 4. Actor Interaction Summary

## Student

Interacts with:

* Authentication
* Book Search
* Reservation
* Borrowing History
* Fine Information
* AI Recommendations

---

## Librarian

Interacts with:

* Book Catalogue Management
* Issue/Return Operations
* Reservation Management
* Fine Management

---

## Administrator

Interacts with:

* User Management
* Reports
* System Monitoring

---

## AI Recommendation Engine

Interacts with:

* Book Database
* Borrowing History
* Recommendation Module

---

# 5. Relationship Summary

```text
Student
   |
   |
Uses
   |
Smart Library System
   |
   |
Uses
   |
AI Recommendation Engine
```

The diagram represents the overall functional relationship between users and system modules.
