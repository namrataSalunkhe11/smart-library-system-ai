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
# 3. System Features

This section describes the major functional features of the Smart Library System with AI Recommendations. Each feature defines the expected behavior of the system and identifies the users involved.

---

# 3.1 User Authentication and Authorization (FR-001)

## Feature ID

FR-001

## Feature Name

User Registration, Login and Role-Based Access Control

---

## Description

The system shall provide secure authentication functionality for students, librarians, and administrators.

Users must register and login using valid credentials. After successful authentication, the system shall provide access according to the assigned user role.

The system will use JWT-based authentication for securing REST API communication.

---

## Actors

* Student
* Librarian
* Administrator

---

## Preconditions

* User account must exist in the system.
* User must provide valid login credentials.
* Database server must be available.

---

## Main Flow

1. User opens the login page.
2. User enters email and password.
3. System validates the provided credentials.
4. System verifies user details from the database.
5. System generates a JWT authentication token.
6. System redirects the user to the appropriate dashboard based on role.

---

## Alternative Flow

### Invalid Credentials

1. User enters incorrect login information.
2. System rejects authentication.
3. System displays an appropriate error message.

### New User Registration

1. User provides required registration details.
2. System validates the information.
3. System creates a new user account.
4. User can login using registered credentials.

---

## Postconditions

* User is authenticated successfully.
* JWT token is generated.
* User receives access according to assigned permissions.

---

## Business Rules

* Email address must be unique.
* Password must be stored securely using hashing.
* Users can access only authorized features.
* Unauthorized API requests must be rejected.
# 3.2 Book Management System (FR-002)

## Feature ID

FR-002

## Feature Name

Book Catalogue Management

---

## Description

The system shall provide functionality for librarians and administrators to manage the library book catalogue.

Authorized users can add new books, update existing book information, remove books, and maintain accurate availability records.

---

## Actors

* Librarian
* Administrator

---

## Preconditions

* User must be authenticated.
* User must have librarian or administrator privileges.
* Database connection must be available.

---

## Main Flow

### Add New Book

1. Librarian opens the book management module.
2. Librarian enters book details.
3. System validates the entered information.
4. System stores book details in the database.
5. System updates the available book catalogue.

---

### Update Book Details

1. Librarian selects an existing book.
2. Librarian modifies required information.
3. System validates changes.
4. System updates the database record.

---

### Remove Book

1. Librarian selects a book record.
2. System checks whether the book is currently issued or reserved.
3. If eligible, the system removes or deactivates the book record.

---

## Book Information Maintained

The system shall maintain:

* Book ID
* ISBN Number
* Title
* Author Name
* Publisher
* Category
* Edition
* Publication Year
* Total Quantity
* Available Quantity
* Book Status

---

## Alternative Flow

### Duplicate Book Entry

1. Librarian enters an existing ISBN number.
2. System checks duplicate records.
3. System prevents duplicate book creation.

---

### Invalid Data Entry

1. User enters incomplete or invalid information.
2. System displays validation errors.
3. User corrects the information.

---

## Postconditions

* Book catalogue is updated successfully.
* Current availability status is maintained.
* Updated information is available for searching and recommendation processing.

---

## Business Rules

* ISBN number must be unique.
* Only authorized users can modify book records.
* Books with active issues cannot be permanently deleted.
* Quantity values cannot be negative.
# 3.3 Smart Book Search and Availability Checking (FR-003)

## Feature ID

FR-003

## Feature Name

Book Search and Availability Management

---

## Description

The system shall provide students and library users with a smart search facility to find books available in the library.

Users shall be able to search books using multiple parameters such as title, author, category, ISBN, and keywords.

The system shall display real-time availability information to help students decide whether a book can be borrowed or reserved.

---

## Actors

* Student
* Librarian
* Administrator

---

## Preconditions

* User must have access to the library system.
* Book catalogue must contain available book records.
* Database service must be operational.

---

## Main Flow

1. User opens the book search module.
2. User enters search criteria.
3. System processes the search request.
4. System retrieves matching books from the database.
5. System displays book information.
6. System shows current availability status.

---

## Search Parameters

The system shall support searching using:

* Book Title
* Author Name
* Category
* ISBN Number
* Keywords

---

## Book Details Displayed

The system shall display:

* Book Title
* Author
* Category
* ISBN
* Publisher
* Publication Year
* Availability Status
* Reservation Option (if unavailable)

---

## Alternative Flow

### No Matching Book Found

1. User enters a search query.
2. System finds no matching records.
3. System displays a message indicating no results found.

---

### Book Currently Unavailable

1. User selects an unavailable book.
2. System displays current issue status.
3. System provides reservation option.

---

## Postconditions

* User receives accurate book information.
* Current availability status is displayed.
* User can proceed with reservation if applicable.

---

## Business Rules

* Search results must display updated availability information.
* Only active books should appear in search results.
* Search should support partial keyword matching.
* Users should not be able to issue unavailable books.
# 3.4 Online Book Reservation System (FR-004)

## Feature ID

FR-004

## Feature Name

Book Reservation and Queue Management

---

## Description

The system shall provide students with the ability to reserve books online when a required book is currently unavailable or limited in quantity.

The reservation module shall allow students to place reservation requests, track reservation status, and receive access to books when they become available.

Librarians shall be able to manage and process reservation requests.

---

## Actors

* Student
* Librarian

---

## Preconditions

* User must be authenticated.
* Selected book must exist in the catalogue.
* Student must have an active account.
* Book reservation feature must be enabled.

---

## Main Flow

### Student Reservation Process

1. Student searches for a book.
2. Student selects a book requiring reservation.
3. System checks book availability.
4. Student submits a reservation request.
5. System creates a reservation record.
6. System assigns reservation status as "Pending".
7. Student can view reservation details.

---

### Librarian Reservation Management

1. Librarian views pending reservation requests.
2. Librarian verifies book availability.
3. Librarian approves or rejects reservation.
4. System updates reservation status.
5. Student receives updated reservation information.

---

## Reservation Information Maintained

The system shall maintain:

* Reservation ID
* Student ID
* Book ID
* Reservation Date
* Reservation Status
* Approval Date
* Expiry Date

---

## Reservation Status

The system shall support:

| Status    | Description                   |
| --------- | ----------------------------- |
| Pending   | Reservation request submitted |
| Approved  | Book available for issue      |
| Completed | Book issued successfully      |
| Cancelled | Reservation cancelled         |
| Expired   | Reservation period completed  |

---

## Alternative Flow

### Duplicate Reservation

1. Student attempts to reserve the same book multiple times.
2. System checks existing reservations.
3. Duplicate reservation request is rejected.

---

### Reservation Cancellation

1. Student cancels an active reservation.
2. System updates reservation status.
3. Book becomes available for other requests.

---

## Postconditions

* Reservation record is created or updated successfully.
* Student can track reservation status.
* Librarian can manage reservation requests.

---

## Business Rules

* A student cannot reserve the same book multiple times simultaneously.
* Only active users can create reservations.
* Reservation expiry period must be maintained.
* Approved reservations should be processed within the defined time period.
* Reservation history must be preserved.
# 3.5 Book Issue, Return and Transaction Management (FR-005)

## Feature ID

FR-005

## Feature Name

Library Transaction Management

---

## Description

The system shall provide functionality for managing book issue and return transactions between students and the library.

The module will maintain complete transaction records, update book availability automatically, and track due dates for borrowed books.

---

## Actors

* Student
* Librarian

---

## Preconditions

* User must be authenticated.
* Student account must be active.
* Selected book must be available for issue.
* Librarian must have transaction management permissions.

---

## Main Flow

### Book Issue Process

1. Student requests a book issue.
2. Librarian verifies student eligibility.
3. System checks book availability.
4. System creates a transaction record.
5. System assigns issue date and due date.
6. System updates available book quantity.
7. Book status changes to issued.

---

### Book Return Process

1. Student returns the borrowed book.
2. Librarian searches transaction details.
3. System verifies return information.
4. System calculates delay if applicable.
5. System updates transaction status.
6. System increases available book quantity.
7. Book becomes available for other users.

---

### Transaction Information Maintained

The system shall maintain:

* Transaction ID
* Student ID
* Book ID
* Issue Date
* Due Date
* Return Date
* Transaction Status
* Fine Amount (if applicable)

---

### Transaction Status

| Status   | Description                        |
| -------- | ---------------------------------- |
| Issued   | Book currently borrowed by student |
| Returned | Book successfully returned         |
| Overdue  | Return date exceeded               |
| Lost     | Book marked as unavailable         |

---

## Alternative Flow

### Book Not Available

1. Student requests unavailable book.
2. System checks inventory status.
3. System suggests reservation option.

---

### Student Has Overdue Books

1. Librarian attempts to issue a new book.
2. System checks previous transactions.
3. System displays overdue information.
4. Issue operation may be restricted according to rules.

---

## Postconditions

* Transaction record is stored successfully.
* Book availability is updated.
* Student borrowing history is maintained.
* Library records remain accurate.

---

## Business Rules

* A student cannot issue more than the allowed number of books.
* Only available books can be issued.
* Due dates must be generated automatically.
* Every issued book must have a corresponding transaction record.
* Returned books must update inventory automatically.
* Transaction history must not be deleted.
# 3.6 Fine Management System (FR-006)

## Feature ID

FR-006

## Feature Name

Automated Fine Calculation and Management

---

## Description

The system shall provide automated fine calculation functionality for overdue book returns.

The system will calculate fines based on the delay period and maintain fine records associated with student transactions.

Librarians can view and manage fine information through the system.

---

## Actors

* Student
* Librarian
* Administrator

---

## Preconditions

* User must be authenticated.
* Book transaction record must exist.
* Due date and return date information must be available.

---

## Main Flow

### Fine Calculation Process

1. Student returns a borrowed book.
2. System compares return date with due date.
3. System calculates the number of overdue days.
4. System applies the configured fine rules.
5. System generates a fine record.
6. Fine information is stored in the database.

---

### Fine Viewing Process

#### Student

1. Student opens fine details.
2. System retrieves pending and previous fines.
3. System displays fine information.

#### Librarian

1. Librarian accesses fine management.
2. System displays student fine records.
3. Librarian can update fine status.

---

## Fine Information Maintained

The system shall maintain:

* Fine ID
* Transaction ID
* Student ID
* Fine Amount
* Number of Late Days
* Generated Date
* Payment Status

---

## Fine Status

| Status  | Description                       |
| ------- | --------------------------------- |
| Pending | Fine generated but not cleared    |
| Paid    | Fine cleared                      |
| Waived  | Fine cancelled by authorized user |

---

## Alternative Flow

### No Delay in Return

1. Student returns book before or on due date.
2. System calculates zero fine.
3. Transaction completes normally.

---

### Fine Rule Update

1. Administrator changes fine configuration.
2. System applies updated rules for future calculations.

---

## Postconditions

* Fine records are stored accurately.
* Students can view their pending fines.
* Librarians can monitor fine status.
* Transaction history remains updated.

---

## Business Rules

* Fine calculation must be automatic.
* Fine amount depends on overdue duration and configured rules.
* Only authorized users can modify fine records.
* Fine history must be maintained for auditing.
* Returning a book does not delete previous fine records.
# 3.7 Borrowing History and Student Activity Tracking (FR-007)

## Feature ID

FR-007

## Feature Name

Student Borrowing History Management

---

## Description

The system shall maintain and provide access to complete borrowing history records of students.

Students shall be able to view previously borrowed books, current issued books, due dates, return status, and associated fine details.

The stored borrowing information will also be used as input data for the AI-based recommendation system.

---

## Actors

* Student
* Librarian
* Administrator

---

## Preconditions

* User must be authenticated.
* Student account must exist.
* Transaction records must be available.

---

## Main Flow

### Student View History

1. Student logs into the system.
2. Student opens borrowing history section.
3. System retrieves transaction records.
4. System displays previous and current borrowing details.

---

### Librarian View Student Activity

1. Librarian searches for a student.
2. System retrieves student transaction history.
3. Librarian reviews borrowing records.

---

## Information Displayed

The system shall display:

* Book Title
* Author
* Issue Date
* Due Date
* Return Date
* Transaction Status
* Fine Details

---

## Activity Categories

The system shall maintain:

#### Current Borrowings

Books currently issued to the student.

#### Previous Borrowings

Books already returned by the student.

#### Overdue Records

Books returned after the due date or currently overdue.

---

## Alternative Flow

### No Borrowing History Available

1. Student opens history section.
2. System finds no previous transactions.
3. System displays an appropriate message.

---

## Postconditions

* Student receives complete borrowing information.
* Library maintains accurate activity records.
* Historical data is available for AI processing.

---

## Business Rules

* Borrowing history cannot be deleted by normal users.
* Every issue and return transaction must be recorded.
* Only authorized users can access student activity details.
* Historical transaction data must be preserved for analysis.

# 3.8 AI Book Recommendation Engine (FR-008)

## Feature ID

FR-008

## Feature Name

Personalized AI-Based Book Recommendation System

---

## Description

The system shall provide personalized book recommendations to students using Artificial Intelligence techniques.

The recommendation engine will analyze book information and student borrowing patterns to suggest relevant books that match the student's interests and academic requirements.

The AI module will use content-based filtering techniques to identify similarities between books.

---

## Actors

* Student
* Administrator

---

## Preconditions

* Student must be authenticated.
* Book catalogue data must be available.
* Sufficient book metadata must exist.
* Borrowing history data should be available for personalization.

---

## Main Flow

### Recommendation Generation Process

1. Student opens recommendation section.
2. System retrieves student profile information.
3. System analyzes previous borrowing history.
4. AI model compares book characteristics.
5. System calculates similarity scores.
6. System generates recommended book list.
7. Recommended books are displayed to the student.

---

## AI Model Inputs

The recommendation system uses:

#### Book Data

* Title
* Author
* Category
* Subject
* Keywords
* Description

#### User Data

* Previously borrowed books
* Preferred categories
* Reading patterns

---

## Recommendation Output

The system shall display:

* Recommended Book Name
* Author
* Category
* Similarity Reason
* Availability Status

---

## Alternative Flow

### New Student Without History

1. Student has no borrowing history.
2. System uses popular books or category-based recommendations.
3. System displays general recommendations.

---

### Insufficient Book Data

1. AI model cannot generate personalized recommendations.
2. System provides category-based suggestions.

---

## Postconditions

* Personalized recommendations are generated.
* Student receives relevant book suggestions.
* Recommendation results improve with additional user activity.

---

## Business Rules

* AI recommendations should not suggest unavailable books as first preference.
* Recommendations must be generated from available library resources.
* Student borrowing data must be protected.
* Recommendation results should be updated periodically.
* AI suggestions should support users, not replace library search functionality.

---

## AI Implementation Overview

The recommendation pipeline will follow:

```
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
Cosine Similarity Calculation
      |
      ↓
Recommended Books
```
# 3.9 Reports and Dashboard System (FR-009)

## Feature ID

FR-009

## Feature Name

Library Analytics and Dashboard Management

---

## Description

The system shall provide role-based dashboards and reports to help users monitor library activities.

The dashboard shall provide different information according to user roles, including student activities, book statistics, transaction summaries, and system usage reports.

---

## Actors

* Student
* Librarian
* Administrator

---

## Preconditions

* User must be authenticated.
* User must have appropriate role permissions.
* Required system data must be available.

---

## Main Flow

### Student Dashboard

1. Student logs into the system.
2. System displays personalized dashboard.
3. Dashboard shows:

* Current issued books
* Due dates
* Fine details
* Reservations
* AI recommendations
* Borrowing history summary

---

### Librarian Dashboard

1. Librarian accesses dashboard.
2. System displays library operation statistics.

Information displayed:

* Total books
* Available books
* Issued books
* Pending reservations
* Overdue books
* Fine records

---

### Administrator Dashboard

1. Administrator accesses system dashboard.
2. System displays overall analytics.

Information displayed:

* Total users
* User activity
* Book statistics
* Transaction reports
* System usage trends

---

## Reports Generated

The system shall support:

* Book inventory reports
* Issue and return reports
* Overdue book reports
* Fine reports
* User activity reports
* Popular book reports

---

## Alternative Flow

### No Data Available

1. User requests a report.
2. System finds insufficient records.
3. System displays an appropriate message.

---

### Unauthorized Report Access

1. User requests restricted information.
2. System validates permissions.
3. Access is denied if permission is insufficient.

---

## Postconditions

* Users receive relevant dashboard information.
* Reports are generated accurately.
* Library activities can be monitored effectively.

---

## Business Rules

* Dashboard information must be role-specific.
* Sensitive information must only be visible to authorized users.
* Reports must be generated using accurate database records.
* Historical records must be maintained for analysis.
