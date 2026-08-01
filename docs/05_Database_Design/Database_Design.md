# Database Design

## Smart Library System with AI Recommendations

---

# 1. Introduction

## 1.1 Purpose

The purpose of this document is to define the database structure required for the Smart Library System with AI Recommendations.

It describes the database entities, attributes, relationships, and data organization used to store and manage library operations.

---

## 1.2 Database Overview

The system uses a relational database model to store structured information.

The database manages:

* User accounts
* Roles and permissions
* Book catalogue
* Authors and categories
* Book transactions
* Reservations
* Fine records
* AI recommendations

---

# 2. Database Management System

## Selected Database

**MySQL**

---

## Reason for Selection

MySQL is selected because:

* It provides reliable relational data storage.
* It supports complex relationships.
* It provides transaction management.
* It is widely used and easy to integrate with backend frameworks.

---

# 3. Database Entities Overview

The Smart Library System consists of the following major entities:

| Entity          | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| Users           | Stores student, librarian, and administrator information |
| Roles           | Maintains user access levels                             |
| Books           | Stores book details                                      |
| Authors         | Stores author information                                |
| Categories      | Stores book categories                                   |
| Transactions    | Maintains issue and return records                       |
| Reservations    | Stores book reservation requests                         |
| Fines           | Maintains fine details                                   |
| Recommendations | Stores AI-generated suggestions                          |

---

# 4. Entity Relationship Overview

```text id="g8r5n2"
Users
 |
 |
 |---- Transactions ---- Books
 |
 |
 |---- Reservations ---- Books
 |
 |
 |---- Fines ---- Transactions
 |
 |
 |---- Recommendations ---- Books


Books
 |
 |
 |---- Authors

Books
 |
 |
 |---- Categories

Roles
 |
 |
 |---- Users
```

---

# 5. Database Design Principles

The database follows:

## Normalization

The database structure follows normalization principles to:

* Reduce data duplication
* Improve consistency
* Maintain data integrity

---

## Primary Keys

Each table contains a unique identifier.

Example:

```text id="m4k7p9"
user_id
book_id
transaction_id
```

---

## Foreign Keys

Relationships between tables are maintained using foreign keys.

Example:

```text id="q2v8s5"
user_id → Users table

book_id → Books table
```
# 6. Database Table Structures

---

# 6.1 Users Table

## Purpose

Stores information about all system users including students, librarians, and administrators.

| Attribute  | Data Type | Description            |
| ---------- | --------- | ---------------------- |
| user_id    | INT (PK)  | Unique user identifier |
| role_id    | INT (FK)  | User role reference    |
| name       | VARCHAR   | User full name         |
| email      | VARCHAR   | Unique email address   |
| password   | VARCHAR   | Encrypted password     |
| phone      | VARCHAR   | Contact number         |
| status     | VARCHAR   | Account status         |
| created_at | DATETIME  | Account creation time  |

---

# 6.2 Roles Table

## Purpose

Maintains different access levels in the system.

| Attribute | Data Type | Description            |
| --------- | --------- | ---------------------- |
| role_id   | INT (PK)  | Unique role identifier |
| role_name | VARCHAR   | Name of role           |

Example roles:

* Student
* Librarian
* Administrator

---

# 6.3 Books Table

## Purpose

Stores complete information about books available in the library.

| Attribute          | Data Type | Description            |
| ------------------ | --------- | ---------------------- |
| book_id            | INT (PK)  | Unique book identifier |
| title              | VARCHAR   | Book title             |
| author_id          | INT (FK)  | Author reference       |
| category_id        | INT (FK)  | Category reference     |
| isbn               | VARCHAR   | ISBN number            |
| publisher          | VARCHAR   | Publisher name         |
| publication_year   | YEAR      | Publication year       |
| quantity           | INT       | Total quantity         |
| available_quantity | INT       | Available books        |

---

# 6.4 Authors Table

## Purpose

Stores author information.

| Attribute   | Data Type | Description              |
| ----------- | --------- | ------------------------ |
| author_id   | INT (PK)  | Unique author identifier |
| author_name | VARCHAR   | Author name              |

---

# 6.5 Categories Table

## Purpose

Stores book category information.

| Attribute     | Data Type | Description                |
| ------------- | --------- | -------------------------- |
| category_id   | INT (PK)  | Unique category identifier |
| category_name | VARCHAR   | Category name              |

---

# 6.6 Transactions Table

## Purpose

Stores book issue and return records.

| Attribute      | Data Type | Description                   |
| -------------- | --------- | ----------------------------- |
| transaction_id | INT (PK)  | Unique transaction identifier |
| user_id        | INT (FK)  | Student reference             |
| book_id        | INT (FK)  | Book reference                |
| issue_date     | DATE      | Book issue date               |
| due_date       | DATE      | Return due date               |
| return_date    | DATE      | Actual return date            |
| status         | VARCHAR   | Transaction status            |

---

# 6.7 Reservations Table

## Purpose

Stores student book reservation requests.

| Attribute        | Data Type | Description                   |
| ---------------- | --------- | ----------------------------- |
| reservation_id   | INT (PK)  | Unique reservation identifier |
| user_id          | INT (FK)  | Student reference             |
| book_id          | INT (FK)  | Book reference                |
| reservation_date | DATE      | Reservation date              |
| status           | VARCHAR   | Reservation status            |

---

# 6.8 Fines Table

## Purpose

Stores overdue fine information.

| Attribute      | Data Type | Description            |
| -------------- | --------- | ---------------------- |
| fine_id        | INT (PK)  | Unique fine identifier |
| transaction_id | INT (FK)  | Transaction reference  |
| amount         | DECIMAL   | Fine amount            |
| status         | VARCHAR   | Payment status         |
| created_at     | DATETIME  | Fine creation date     |

---

# 6.9 Recommendations Table

## Purpose

Stores AI-generated book recommendations.

| Attribute         | Data Type | Description                      |
| ----------------- | --------- | -------------------------------- |
| recommendation_id | INT (PK)  | Unique recommendation identifier |
| user_id           | INT (FK)  | Student reference                |
| book_id           | INT (FK)  | Recommended book                 |
| score             | FLOAT     | Recommendation similarity score  |
| generated_at      | DATETIME  | Generation timestamp             |

---

# 7. Database Relationship Summary

| Relationship           | Type        |
| ---------------------- | ----------- |
| Role → Users           | One-to-Many |
| User → Transactions    | One-to-Many |
| Book → Transactions    | One-to-Many |
| User → Reservations    | One-to-Many |
| Book → Reservations    | One-to-Many |
| Transaction → Fines    | One-to-One  |
| User → Recommendations | One-to-Many |
| Book → Recommendations | One-to-Many |
