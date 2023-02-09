-- Create employees_db database (drop if it already exists and then recreate it)
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Use employees_db database
USE employees_db;

-- Create department table within employees_db that has an auto-incrementing id set as the primary key and a name up to 30 characters
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL 
);

-- Create roles table within employees_db that has an auto-incrementing id set as the primary key, a title up to 30 characters, salary that is a decimal with up to 8 digits before the decimal and 2 after the decimal, and a department_id that is an int
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(45) NOT NULL,
    salary DECIMAL (10,2),
    department_id INT NOT NULL
);

-- Create employee table within employees_db that has an auto-incrementing id set as the primary key, a first_name and last_name up to 30 characters, a role_id that is an int, and a manager_id that is an int
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
);