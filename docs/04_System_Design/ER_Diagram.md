# Entity Relationship Diagram (ER Diagram)

## Smart Library System with AI Recommendations

---

# 1. Introduction

The Entity Relationship Diagram represents the database structure of the Smart Library System.

It shows entities, attributes, primary keys, foreign keys, and relationships between different database components.

---

# 2. ER Diagram

The following ER diagram uses Mermaid notation.

```mermaid
erDiagram

    ROLES ||--o{ USERS : has

    USERS ||--o{ TRANSACTIONS : creates
    BOOKS ||--o{ TRANSACTIONS : involved_in

    USERS ||--o{ RESERVATIONS : makes
    BOOKS ||--o{ RESERVATIONS : receives

    TRANSACTIONS ||--o| FINES : generates

    USERS ||--o{ RECOMMENDATIONS : receives
    BOOKS ||--o{ RECOMMENDATIONS : suggested

    AUTHORS ||--o{ BOOKS : writes
    CATEGORIES ||--o{ BOOKS : contains


    ROLES {
        int role_id PK
        varchar role_name
    }

    USERS {
        int user_id PK
        int role_id FK
        varchar name
        varchar email
        varchar password
        varchar phone
        varchar status
        datetime created_at
    }

    BOOKS {
        int book_id PK
        int author_id FK
        int category_id FK
        varchar title
        varchar isbn
        varchar publisher
        year publication_year
        int quantity
        int available_quantity
    }

    AUTHORS {
        int author_id PK
        varchar author_name
    }

    CATEGORIES {
        int category_id PK
        varchar category_name
    }

    TRANSACTIONS {
        int transaction_id PK
        int user_id FK
        int book_id FK
        date issue_date
        date due_date
        date return_date
        varchar status
    }

    RESERVATIONS {
        int reservation_id PK
        int user_id FK
        int book_id FK
        date reservation_date
        varchar status
    }

    FINES {
        int fine_id PK
        int transaction_id FK
        decimal amount
        varchar status
        datetime created_at
    }

    RECOMMENDATIONS {
        int recommendation_id PK
        int user_id FK
        int book_id FK
        float score
        datetime generated_at
    }
```

---

# 3. Relationship Explanation

## Roles and Users

**Relationship: One-to-Many**

* One role can belong to many users.
* Each user has one assigned role.

Example:

```text
Administrator Role → Multiple Administrators
Student Role → Multiple Students
```

---

## Users and Transactions

**Relationship: One-to-Many**

* One student can have multiple borrowing transactions.
* Each transaction belongs to one user.

---

## Books and Transactions

**Relationship: One-to-Many**

* One book can appear in multiple transaction records.
* Each transaction references one book.

---

## Users and Reservations

**Relationship: One-to-Many**

* One student can create multiple reservations.
* Each reservation belongs to one student.

---

## Transactions and Fines

**Relationship: One-to-One**

* One transaction can generate one fine record.
* Fine is created only when overdue conditions occur.

---

## Users and Recommendations

**Relationship: One-to-Many**

* One student can receive multiple recommendations.
* Each recommendation belongs to one student.

---

## Books and Recommendations

**Relationship: One-to-Many**

* One book can be recommended to multiple users.

---

# 4. Database Design Summary

The ER model provides:

* Data consistency
* Proper relationship management
* Reduced duplication
* Easy database maintenance
* Support for AI recommendation processing

---

The ER Diagram acts as the blueprint for implementing the MySQL database.
