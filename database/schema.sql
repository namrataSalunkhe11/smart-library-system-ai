-- ==========================================
-- Smart Library System Database Schema
-- ==========================================

CREATE DATABASE IF NOT EXISTS smart_library;
USE smart_library;

-- ==========================================
-- Roles Table
-- ==========================================

CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- ==========================================
-- Users Table
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',

    FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
);

-- ==========================================
-- Default Roles
-- ==========================================

INSERT INTO roles (role_name, description)
VALUES
('Admin', 'System Administrator'),
('Librarian', 'Library Staff'),
('Student', 'Library Member');


show tables;

DROP DATABASE IF EXISTS smart_library;
CREATE DATABASE smart_library;
SHOW DATABASES;
 
use smart_library;
INSERT INTO roles (role_name, description)
VALUES
('Admin', 'System Administrator'),
('Librarian', 'Library Staff'),
('Student', 'Library Member');

SELECT * FROM roles;

SELECT
    *
FROM users;
USE smart_library;

SHOW TABLES;
DESCRIBE authors;
INSERT INTO authors (author_name, biography)
VALUES ('Robert C. Martin', 'Author of Clean Code');
INSERT INTO categories (category_name, description)
VALUES ('Computer Science', 'Books related to computer science');
SELECT * FROM books;
USE smart_library;

SHOW TABLES;
INSERT INTO authors (author_name, biography)
VALUES ('Robert C. Martin', 'Author of Clean Code');
INSERT INTO categories (category_name, description)
VALUES ('Computer Science', 'Books related to computer science');

SELECT * FROM books;
USE smart_library;

SELECT * FROM books;
USE smart_library;

SELECT * FROM books;
SELECT * FROM book_copies;
USE smart_library;

SELECT * FROM issue_transactions;

UPDATE issue_transactions
SET due_date = DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE transaction_id = 2;

SELECT * FROM users;
SELECT * FROM book_copies;