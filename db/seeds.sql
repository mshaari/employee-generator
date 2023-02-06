INSERT INTO department (name) 
VALUES
    ('Human Resources'),
    ('IT'),
    ('Customer Service'),
    ('Sales'),
    ('Research and Development');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Customer Service Representative', 60000, 3),
    ('Sales Representative', 50000, 4),
    ('IT Specialist', 75000, 2),
    ('Human Resources Representative', 55000, 1),
    ('Research and Development Software Engineer', 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Steve', 'Jobs', 4, 6),
    ('Tim', 'Cook', 1, 3),
    ('Jeff', 'Bezos', 2, 8),
    ('Mark', 'Zuckerberg', 7, 5),
    ('Michael', 'Scott', 4, 3),
    ('Dwight', 'Schrute', 2, null)