# Use Case Specification

## Smart Library System with AI Recommendations

---

## Document Information

| Field         | Details                                      |
| ------------- | -------------------------------------------- |
| Document Name | Use Case Specification                       |
| Project Name  | Smart Library System with AI Recommendations |
| Version       | 1.0                                          |
| Prepared By   | Namrata Salunkhe                             |
| Document Type | System Design Document                       |

---

# 1. Introduction

## 1.1 Purpose

The purpose of this Use Case Specification document is to define the interactions between users and the Smart Library System with AI Recommendations.

This document identifies system actors, their responsibilities, and the functional interactions required to achieve system objectives.

The use cases described here will serve as a foundation for system design, database design, API development, and testing.

---

## 1.2 Scope

This document describes how different users interact with the Smart Library System.

The major interactions include:

* User authentication
* Book searching
* Book reservation
* Book issue and return
* Fine management
* Borrowing history tracking
* AI-based book recommendation
* Report generation

---

# 2. System Actors

## 2.1 Student

The Student is the primary user of the system who interacts with library services digitally.

Responsibilities:

* Login into the system
* Search available books
* View book details
* Reserve books
* View issued books
* Track borrowing history
* View fines
* Receive AI recommendations

---

## 2.2 Librarian

The Librarian manages daily library operations.

Responsibilities:

* Manage book catalogue
* Issue books
* Accept book returns
* Manage reservations
* Maintain transaction records
* Monitor fines

---

## 2.3 Administrator

The Administrator manages overall system control.

Responsibilities:

* Manage user accounts
* Monitor system activities
* Access reports
* Configure system settings

---

## 2.4 AI Recommendation Engine

The AI Recommendation Engine is an internal system component responsible for generating personalized book recommendations.

Responsibilities:

* Analyze book metadata
* Analyze borrowing patterns
* Calculate book similarity
* Generate recommendations
# 3. Use Case List

The following use cases represent the major interactions between system actors and the Smart Library System.

| Use Case ID | Use Case Name                       | Primary Actor                     |
| ----------- | ----------------------------------- | --------------------------------- |
| UC-001      | User Registration and Login         | Student, Librarian, Administrator |
| UC-002      | Manage User Accounts                | Administrator                     |
| UC-003      | Manage Book Catalogue               | Librarian, Administrator          |
| UC-004      | Search and View Books               | Student, Librarian                |
| UC-005      | Reserve Book                        | Student                           |
| UC-006      | Issue and Return Book               | Librarian                         |
| UC-007      | Manage Fine Records                 | Librarian, Administrator          |
| UC-008      | View Borrowing History              | Student                           |
| UC-009      | Generate AI Book Recommendations    | AI Engine, Student                |
| UC-010      | Generate Reports and Dashboard Data | Administrator, Librarian          |

---

# 4. Use Case Relationship Overview

The interaction flow between actors and use cases is:

```
                    Administrator
                         |
        ------------------------------------
        |                                  |
 Manage Users                    Generate Reports
        |
        |
Student ---------------- Smart Library System ---------------- Librarian
   |                              |                              |
   |                              |                              |
Login                       Book Management              Issue/Return Books
Search Books                Reservation Management      Fine Management
View History
AI Recommendations

                         |
                         |
              AI Recommendation Engine
```

---

# 5. Use Case Documentation Format

Each detailed use case will contain:

| Attribute        | Description                   |
| ---------------- | ----------------------------- |
| Use Case ID      | Unique identifier             |
| Use Case Name    | Name of functionality         |
| Primary Actor    | Main user interacting         |
| Goal             | Objective of the use case     |
| Preconditions    | Conditions before execution   |
| Main Flow        | Normal execution steps        |
| Alternative Flow | Exception scenarios           |
| Postconditions   | System state after completion |
| Business Rules   | Related constraints           |
# 6. Detailed Use Case Specifications

---

# UC-001: User Registration and Login

## Use Case ID

UC-001

---

## Use Case Name

User Registration and Login

---

## Primary Actor

* Student
* Librarian
* Administrator

---

## Goal

To provide secure authentication and role-based access to the Smart Library System.

---

## Description

This use case allows users to create an account and authenticate themselves using valid credentials.

After successful login, the system verifies user identity, generates a JWT authentication token, and provides access according to the assigned role.

---

## Preconditions

* User account must exist for login.
* System database must be available.
* User must provide valid credentials.

---

## Trigger

User opens the login or registration page.

---

# Main Flow

## Registration Flow

1. User enters registration details.
2. System validates the provided information.
3. System checks whether the email already exists.
4. System creates a new user account.
5. System stores encrypted password information.
6. Registration completes successfully.

---

## Login Flow

1. User enters email and password.
2. System receives authentication request.
3. System validates credentials.
4. System identifies user role.
5. System generates JWT token.
6. System grants access to authorized features.

---

# Alternative Flow

## Invalid Credentials

1. User enters incorrect login details.
2. System rejects authentication.
3. Error message is displayed.

---

## Duplicate Registration

1. User enters an already registered email.
2. System detects existing account.
3. Registration request is rejected.

---

# Postconditions

* User is successfully authenticated.
* JWT token is generated.
* User accesses role-specific dashboard.

---

# Business Rules

* Email address must be unique.
* Passwords must not be stored in plain text.
* Users can access only permitted features.
* Authentication failures must be handled securely.

---

# Related Requirements

* SRS FR-001: User Authentication and Authorization

---

# Related Components

Database:

```
text id="4v8xkq"
users
roles
```

API:

```
text id="nqk4rf"
POST /api/auth/register

POST /api/auth/login
```

Frontend:

```
text id="3s8q5c"
Login Page
Registration Page
```
# UC-002: Manage User Accounts

## Use Case ID

UC-002

---

## Use Case Name

Manage User Accounts

---

## Primary Actor

Administrator

---

## Goal

To allow administrators to manage user accounts and control access permissions within the Smart Library System.

---

## Description

This use case allows the administrator to view, create, update, and manage accounts of students and librarians.

The administrator can assign appropriate roles and control user account status.

---

## Preconditions

* Administrator must be authenticated.
* Administrator must have valid permissions.
* User management module must be available.

---

## Trigger

Administrator opens the user management section.

---

# Main Flow

1. Administrator accesses the user management module.
2. System displays the list of registered users.
3. Administrator selects a required operation.
4. Administrator can:

   * Add new user accounts.
   * Update user details.
   * Assign or modify roles.
   * Activate or deactivate accounts.
5. System validates changes.
6. System updates user information in the database.
7. System displays operation success message.

---

# Alternative Flow

## Invalid User Information

1. Administrator enters incorrect user details.
2. System validates the data.
3. System displays validation error.
4. Administrator corrects the information.

---

## Unauthorized Access

1. Non-admin user attempts to access user management.
2. System checks permissions.
3. Access is denied.

---

# Postconditions

* User account information is updated.
* User roles are maintained correctly.
* System access permissions are applied.

---

# Business Rules

* Only administrators can manage user accounts.
* Each user must have a unique email address.
* Every user must have an assigned role.
* Deactivated users cannot access the system.

---

# Related Requirements

* SRS FR-001: User Authentication and Authorization
* SRS FR-009: Reports and Dashboard

---

# Related Components

Database:

```text id="3v6spm"
users
roles
```

API:

```text id="ax1m2r"
GET    /api/users

POST   /api/users

PUT    /api/users/{id}

DELETE /api/users/{id}
```

Frontend:

```text id="u5q9je"
Admin Dashboard
User Management Module
```
# UC-003: Manage Book Catalogue

## Use Case ID

UC-003

---

## Use Case Name

Manage Book Catalogue

---

## Primary Actor

* Librarian
* Administrator

---

## Goal

To allow authorized users to maintain accurate book records and manage the library catalogue.

---

## Description

This use case allows librarians and administrators to add new books, update existing book information, and manage book availability within the system.

The module maintains complete information about books including title, author, category, ISBN, quantity, and availability status.

---

## Preconditions

* User must be authenticated.
* User must have librarian or administrator privileges.
* Database connection must be available.

---

## Trigger

Librarian or administrator opens the book management module.

---

# Main Flow

1. User accesses the book catalogue management section.
2. System displays existing book records.
3. User selects required operation.

The user can:

* Add a new book.
* Update existing book details.
* Remove or deactivate a book record.
* View book availability information.

4. System validates entered information.
5. System updates the database.
6. System displays operation completion message.

---

# Alternative Flow

## Duplicate Book Entry

1. User enters book information.
2. System checks ISBN uniqueness.
3. Duplicate record is detected.
4. System rejects the new entry.

---

## Invalid Book Information

1. User enters incomplete information.
2. System performs validation.
3. System displays correction message.

---

# Postconditions

* Book catalogue is updated successfully.
* Availability information remains accurate.
* Updated records are available for searching and recommendation processing.

---

# Business Rules

* ISBN number must be unique.
* Only authorized users can modify book records.
* Issued books cannot be permanently deleted.
* Quantity values cannot be negative.

---

# Related Requirements

* SRS FR-002: Book Catalogue Management

---

# Related Components

Database:

```text id="l0p5xk"
books
categories
authors
```

API:

```text id="bx9m1f"
POST   /api/books

GET    /api/books

PUT    /api/books/{id}

DELETE /api/books/{id}
```

Frontend:

```text id="b6xk9w"
Librarian Dashboard

Book Management Module
```
# UC-004: Search and View Books

## Use Case ID

UC-004

---

## Use Case Name

Search and View Books

---

## Primary Actor

* Student
* Librarian

---

## Goal

To allow users to search available books and view detailed information before performing library operations.

---

## Description

This use case allows students and librarians to search for books using different search criteria.

The system retrieves matching book records and displays book details along with current availability status.

---

## Preconditions

* User must have access to the library system.
* Book catalogue must contain book records.
* Database service must be available.

---

## Trigger

User opens the book search module.

---

# Main Flow

1. User enters search criteria.
2. System accepts the search request.
3. System searches the book catalogue.
4. System retrieves matching records.
5. System displays book details.
6. System shows current availability status.

---

# Search Options

Users can search using:

* Book title
* Author name
* Category
* ISBN number
* Keywords

---

# Book Information Displayed

The system displays:

* Book title
* Author
* Category
* ISBN
* Publisher
* Publication year
* Available quantity
* Availability status

---

# Alternative Flow

## No Matching Results

1. User enters a search query.
2. System finds no matching books.
3. System displays "No books found" message.

---

## Book Not Available

1. User selects unavailable book.
2. System displays current status.
3. System provides reservation option.

---

# Postconditions

* User receives accurate book information.
* Availability status is displayed.
* User can proceed with reservation or issue request.

---

# Business Rules

* Only active books should appear in search results.
* Availability information must be updated in real time.
* Users cannot issue unavailable books.
* Search should support partial keyword matching.

---

# Related Requirements

* SRS FR-003: Smart Book Search and Availability Checking

---

# Related Components

Database:

```text id="w8b9m0"
books
categories
authors
book_inventory
```

API:

```text id="6t0jkp"
GET /api/books/search

GET /api/books/{id}
```

Frontend:

```text id="r2y4t7"
Student Dashboard

Book Search Module
```
# UC-005: Reserve Book

## Use Case ID

UC-005

---

## Use Case Name

Reserve Book

---

## Primary Actor

Student

---

## Supporting Actor

Librarian

---

## Goal

To allow students to reserve books online when the required book is unavailable or currently issued.

---

## Description

This use case allows students to place reservation requests for books through the system.

The system records reservation details and allows librarians to manage reservation requests.

---

## Preconditions

* Student must be authenticated.
* Student account must be active.
* Selected book must exist in the catalogue.
* Reservation functionality must be available.

---

## Trigger

Student selects the reservation option for a book.

---

# Main Flow

1. Student searches for a required book.
2. Student selects a book.
3. System checks book availability.
4. Student submits a reservation request.
5. System creates a reservation record.
6. System assigns reservation status as "Pending".
7. Student can view reservation details.
8. Librarian reviews the reservation request.
9. Librarian approves or rejects the request.
10. System updates reservation status.

---

# Alternative Flow

## Duplicate Reservation

1. Student attempts to reserve the same book again.
2. System checks existing reservations.
3. Duplicate request is rejected.

---

## Reservation Cancellation

1. Student selects an active reservation.
2. Student cancels the reservation.
3. System updates reservation status.
4. Book becomes available for other requests.

---

## Book Becomes Available

1. Reserved book is returned.
2. System identifies pending reservations.
3. Librarian processes the reservation request.

---

# Postconditions

* Reservation record is created or updated.
* Student can track reservation status.
* Librarian can manage reservation requests.

---

# Business Rules

* A student cannot reserve the same book multiple times.
* Only active students can create reservations.
* Reservation status must be maintained.
* Reservation history must be preserved.
* Expired reservations should be automatically updated.

---

# Related Requirements

* SRS FR-004: Online Book Reservation System

---

# Related Components

Database:

```text id="s8v1r2"
reservations
users
books
```

API:

```text id="2g0m5n"
POST /api/reservations

GET /api/reservations/student

PUT /api/reservations/{id}/status
```

Frontend:

```text id="z5m8px"
Student Dashboard

Reservation Module

Librarian Dashboard

Reservation Management
```
# UC-006: Issue and Return Book

## Use Case ID

UC-006

---

## Use Case Name

Issue and Return Book

---

## Primary Actor

Librarian

---

## Supporting Actor

Student

---

## Goal

To manage book issuing and returning operations while maintaining accurate transaction records.

---

## Description

This use case allows librarians to issue books to students and process returned books.

The system automatically maintains transaction records, updates book availability, and tracks due dates.

---

## Preconditions

* Librarian must be authenticated.
* Student account must be active.
* Book record must exist.
* Book must be available for issue.

---

## Trigger

Librarian starts an issue or return transaction.

---

# Main Flow

## Book Issue Process

1. Student requests a book.
2. Librarian searches for student record.
3. Librarian verifies student eligibility.
4. System checks book availability.
5. Librarian confirms issue operation.
6. System creates transaction record.
7. System generates issue date and due date.
8. System updates book availability.
9. Book status changes to issued.

---

## Book Return Process

1. Student returns the borrowed book.
2. Librarian searches transaction record.
3. System verifies issued book details.
4. System records return date.
5. System calculates overdue duration if applicable.
6. System updates transaction status.
7. System increases available book quantity.

---

# Alternative Flow

## Book Not Available

1. Student requests unavailable book.
2. System displays unavailable status.
3. Student can reserve the book.

---

## Student Has Overdue Books

1. Librarian attempts new issue.
2. System checks previous transactions.
3. System displays overdue information.
4. Issue operation may be restricted.

---

# Postconditions

* Transaction record is stored.
* Book availability is updated.
* Student borrowing history is updated.

---

# Business Rules

* Only available books can be issued.
* Each issue must create a transaction record.
* Due dates must be generated automatically.
* Returned books must update inventory.
* Students cannot exceed allowed borrowing limits.

---

# Related Requirements

* SRS FR-005: Issue and Return Management

---

# Related Components

Database:

```text id="p7v3m8"
transactions
books
users
```

API:

```text id="m4k9s1"
POST /api/transactions/issue

PUT /api/transactions/{id}/return

GET /api/transactions/student/{id}
```

Frontend:

```text id="q8r2d5"
Librarian Dashboard

Issue Book Module

Return Book Module
```
# UC-007: Manage Fine Records

## Use Case ID

UC-007

---

## Use Case Name

Manage Fine Records

---

## Primary Actor

Librarian

---

## Supporting Actors

* Student
* Administrator

---

## Goal

To automatically calculate, maintain, and monitor fines generated from overdue book returns.

---

## Description

This use case allows the system to calculate fines based on overdue duration and maintain fine records.

Students can view their fine details, while librarians and administrators can manage fine information.

---

## Preconditions

* User must be authenticated.
* Transaction record must exist.
* Due date and return date information must be available.

---

## Trigger

A book is returned after the due date or a user accesses fine information.

---

# Main Flow

## Fine Generation Process

1. Student returns a book.
2. System compares return date with due date.
3. System calculates overdue days.
4. System applies configured fine rules.
5. System creates a fine record.
6. Fine details are stored.

---

## Fine Viewing Process

1. Student or librarian opens fine section.
2. System retrieves fine records.
3. System displays fine information.
4. User views current and previous fine details.

---

# Alternative Flow

## No Fine Required

1. Book is returned before due date.
2. System calculates zero fine.
3. Transaction completes successfully.

---

## Fine Status Update

1. Authorized user updates fine status.
2. System validates permission.
3. System updates payment status.

---

# Postconditions

* Fine record is generated if applicable.
* Student can view fine information.
* Library maintains fine history.

---

# Business Rules

* Fine calculation must be automatic.
* Only authorized users can update fine status.
* Fine history cannot be deleted.
* Fine rules should be configurable.
* Every fine must be linked with a transaction.

---

# Related Requirements

* SRS FR-006: Fine Management System

---

# Related Components

Database:

```text id="h3m7q1"
fines
transactions
users
```

API:

```text id="s5x9p2"
GET /api/fines/student/{id}

PUT /api/fines/{id}/status
```

Frontend:

```text id="r9v2k6"
Student Dashboard

Fine Details

Librarian Dashboard

Fine Management
```
# UC-008: View Borrowing History

## Use Case ID

UC-008

---

## Use Case Name

View Borrowing History

---

## Primary Actor

Student

---

## Supporting Actors

* Librarian
* Administrator

---

## Goal

To allow students to view their previous and current book borrowing activities.

---

## Description

This use case allows students to access complete borrowing history including issued books, returned books, due dates, and fine details.

The stored history also provides data support for AI-based recommendation generation.

---

## Preconditions

* Student must be authenticated.
* Student account must exist.
* Transaction records must be available.

---

## Trigger

Student opens the borrowing history section.

---

# Main Flow

1. Student logs into the system.
2. Student selects borrowing history.
3. System identifies the student account.
4. System retrieves transaction records.
5. System displays borrowing details.

Displayed information includes:

* Book title
* Author
* Issue date
* Due date
* Return date
* Transaction status
* Fine information

---

# Alternative Flow

## No History Available

1. Student opens borrowing history.
2. System finds no previous transactions.
3. System displays appropriate information.

---

## Restricted Access

1. User attempts to access another student's history.
2. System verifies authorization.
3. Access is denied.

---

# Postconditions

* Student receives borrowing information.
* Historical records remain available.
* Data can be used for recommendation analysis.

---

# Business Rules

* Students can view only their own borrowing history.
* Transaction records cannot be deleted by students.
* Every issue and return operation must be recorded.
* Historical data must be preserved.

---

# Related Requirements

* SRS FR-007: Borrowing History and Student Activity Tracking

---

# Related Components

Database:

```text id="j8p2w6"
transactions
books
users
```

API:

```text id="r4m7t9"
GET /api/history/student/{id}
```

Frontend:

```text id="v6q1s8"
Student Dashboard

My Borrowing History
```
# UC-009: Generate AI Book Recommendations

## Use Case ID

UC-009

---

## Use Case Name

Generate AI Book Recommendations

---

## Primary Actor

Student

---

## Supporting Actor

AI Recommendation Engine

---

## Goal

To provide personalized book suggestions to students based on their interests and previous borrowing patterns.

---

## Description

This use case describes how the AI Recommendation Engine analyzes available book information and student activity data to generate personalized recommendations.

The system uses content-based filtering techniques to identify similar books and suggest relevant resources.

---

## Preconditions

* Student must be authenticated.
* Book catalogue data must be available.
* AI recommendation model must be available.
* Required book metadata must exist.

---

## Trigger

Student opens the recommendation section.

---

# Main Flow

1. Student requests book recommendations.
2. System identifies the student profile.
3. System retrieves borrowing history.
4. AI engine processes book and user data.
5. System extracts book features.
6. Similarity calculation is performed.
7. AI engine generates recommended books.
8. System displays recommendations to the student.

---

# AI Processing Flow

```text
Book Dataset
      |
      ↓
Data Preprocessing
      |
      ↓
Feature Extraction
      |
      ↓
TF-IDF Vectorization
      |
      ↓
Cosine Similarity
      |
      ↓
Recommended Books
```

---

# Alternative Flow

## New Student Without History

1. Student has no previous borrowing records.
2. System identifies insufficient personal data.
3. System provides popular or category-based recommendations.

---

## Insufficient Book Data

1. Required metadata is unavailable.
2. AI model cannot generate personalized results.
3. System provides general recommendations.

---

# Postconditions

* Personalized recommendations are displayed.
* Recommendation records may be stored.
* Student receives relevant book suggestions.

---

# Business Rules

* Recommendations must be generated from available library resources.
* Student data must be handled securely.
* AI suggestions should improve with additional user activity.
* Unavailable books should not be prioritized.
* AI recommendations should support normal search functionality.

---

# Related Requirements

* SRS FR-008: AI Book Recommendation Engine

---

# Related Components

Database:

```text id="k4n8s2"
books
users
transactions
recommendations
```

AI Module:

```text id="m7q3x9"
recommendation_engine.py

model_training.py
```

API:

```text id="p2r6v8"
GET /api/recommendations/student/{id}
```

Frontend:

```text id="u9c5w1"
Student Dashboard

Recommended For You Section
```
# UC-010: Generate Reports and Dashboard Data

## Use Case ID

UC-010

---

## Use Case Name

Generate Reports and Dashboard Data

---

## Primary Actors

* Administrator
* Librarian

---

## Supporting Actor

Student

---

## Goal

To provide role-based dashboards and generate useful reports for monitoring library activities.

---

## Description

This use case allows administrators and librarians to view system statistics and generate reports based on library operations.

Students can access their personalized dashboard information.

---

## Preconditions

* User must be authenticated.
* User must have appropriate permissions.
* Required system data must be available.

---

## Trigger

User opens the dashboard or report section.

---

# Main Flow

## Student Dashboard

1. Student logs into the system.
2. System loads personalized information.
3. Dashboard displays:

* Current borrowed books
* Due dates
* Fine details
* Reservations
* AI recommendations

---

## Librarian Dashboard

1. Librarian opens dashboard.
2. System retrieves library statistics.
3. Dashboard displays:

* Total books
* Available books
* Issued books
* Pending reservations
* Overdue books
* Fine records

---

## Administrator Reports

1. Administrator selects report type.
2. System collects required data.
3. System processes information.
4. System generates report.
5. Report is displayed.

---

# Report Types

The system supports:

* Book inventory report
* Issue and return report
* Fine report
* User activity report
* Popular books report

---

# Alternative Flow

## No Data Available

1. User requests report.
2. System finds insufficient data.
3. System displays appropriate message.

---

## Unauthorized Access

1. User requests restricted report.
2. System checks permissions.
3. Access is denied.

---

# Postconditions

* Dashboard information is displayed.
* Reports are generated successfully.
* Library activities can be monitored.

---

# Business Rules

* Dashboard information must be role-based.
* Only authorized users can access reports.
* Reports must use accurate database information.
* Historical records must be maintained.

---

# Related Requirements

* SRS FR-009: Reports and Dashboard System

---

# Related Components

Database:

```text id="n5r7v2"
users
books
transactions
reservations
fines
```

API:

```text id="x4m8p6"
GET /api/dashboard/student

GET /api/dashboard/librarian

GET /api/reports
```

Frontend:

```text id="q6s2k9"
Student Dashboard

Librarian Dashboard

Admin Dashboard
```
