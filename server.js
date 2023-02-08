// MySQL2, inquirer, and console.table dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Connect to our database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        // Add MySQL password here
        password: 'Password123%',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// Connect to mySQL database
db.connect(function (err) {
    if (err) return console.log(err);
    // Call inquirerPrompt(), which is defined below
    inquirerPrompt();
});

// inquirerPrompt() is the "main" function in a way, it is what initiates our code since it is the first thing called. It shows all the funcitonality of the employee tracker and then redirects them to the corresponding function 
const inquirerPrompt = () => {
    // Prompt these questions using inquirer
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then((answers) => { // After they select their choice, run their response through a number of if statements that will redirect them to the corresponding function for their desired action
        const { choices } = answers;

        // If they selected "View all departments" in the inquirer.prompt section, this will take them to the function viewDepartments() which is defined later in the code and displays all the departments
        if (choices === "View all departments") {
            viewDepartments();
        }

        // If they selected "View all roles" in the inquirer.prompt section, this will take them to the function viewRoles() which is defined later in the code and displays all roles
        if (choices === "View all roles") {
            viewRoles();
        }

        // If they selected "View all employees" in the inquirer.prompt section, this will take them to the function viewEmployees() which is defined later in the code and displays all the employees
        if (choices === "View all employees") {
            viewEmployees();
        }

        // If they selected "Add a department" in the inquirer.prompt section, this will take them to the function addDepartment() which is defined later in the code and allows the user to add a department
        if (choices === "Add a department") {
            addDepartment();
        }

        // If they selected "Add a role" in the inquirer.prompt section, this will take them to the function addRole() which is defined later in the code and allows the user to add a role
        if (choices === "Add a role") {
            addRole();
        }

        // If they selected "Add an employee" in the inquirer.prompt section, this will take them to the function addEmployee() which is defined later in the code and allows the user to add an employee
        if (choices === "Add an employee") {
            addEmployee();
        }

        // If they selected "Update an employee role" in the inquirer.prompt section, this will take them to the function updateEmployee() which is defined later in the code and allows the user to update an employee's role
        if (choices === "Update an employee role") {
            updateEmployee();
        }

        // If they selected "Exit" in the inquirer.prompt section, this will end the connection to the database and quit
        if (choices === "Exit") {
            db.end();
        }
    });
};

// This function displays all the departments from the db in a table
viewDepartments = () => {
    console.log('All departments are showing.');

    // MySQL query that generates a table with information from the department table with department.id set as id, department.name set as name
    const mysql = `SELECT department.id AS id, department.name AS department FROM department`;

    // Here is the db query that will run the query defined in "const mysql"
    db.query(mysql, (err, rows) => {
        if (err) return console.log(err);

        // Generate a formatted table with the information
        console.table(rows);

        // Re-prompt the user with the initial inquirer prompts to see what they want to do next
        inquirerPrompt();
    });
};

// This function displays all roles
viewRoles = () => {
    console.log('Show all roles.');

    // MySQL query that generates a table using the roles.id, roles.title, roles.salary, and department.name as department and roles.department_id as department.id
    const mysql = `SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`;

    db.query(mysql, (err, rows) => {
        console.table(rows);
        inquirerPrompt();
    });
};

// This function displays all employees
viewEmployees = () => {
    console.log('All employees are showing.');

    // mySQL query that displays the employee id, first name, last name, role, department, salary, and manager
    const mysql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;

    db.query(mysql, (err, rows) => {
        if (err) return console.log(err);
        console.table(rows);
        inquirerPrompt();
    });
};

// This function allows the user to add a department
addDepartment = () => {
    // Ask the user the name of the department they want to add
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you want to add?',
        }
    ]).then(answer => {
        // Query to insert the department to the department table
        const mysql = `INSERT INTO department (name) VALUES (?)`;
        db.query(mysql, answer.department, (err, results) => {
            if (err) return console.log(err);
            console.log('Added' + answer.department + "to departments");
            // Display departments after added by calling viewDepartments();
            viewDepartments();
        });
    });
};

// This function allows the user to add a role
addRole = () => {
    // Ask the user what role they want to add and what the annual salary is for that role
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: "What is the name of the role?",

        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the annual salary?',
        }
    ]).then(answer => {
        // Create "parameters" array with the role and salary they entered in inquirer.prompt
        const parameters = [answer.roles, answer.salary];

        // mySQL query that selects name and id from department table
        const roles_var = `SELECT name, id FROM department`;

        db.query(roles_var, (err, data) => {
            if (err) return console.log(err);
            // Set name = the name of department and the value = the id of that department 
            const department_var = data.map(({ name, id }) => ({ name: name, value: id }));

            // Ask the user what department their role is in (with the options as the departments pulled from the query)
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_selection',
                    message: "What department is this role in?",
                    choices: department_var
                }
            ]).then(selectedDepartment => {
                // Set department_var = the department they selected
                const department_var = selectedDepartment.department_selection;

                // Push that department to "parameters" of the new role
                parameters.push(department_var);

                // mySQL query to add new role to the roles table
                const mysql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

                db.query(mysql, parameters, (err, result) => {
                    if (err) return console.log(err);

                    // Console.log confirmation of adding role
                    console.log('Added ' + answer.roles + ' to roles');

                    // Display the roles
                    viewRoles();
                });
            });
        });
    });
};

// This function allows the user to add an employee 
addEmployee = () => {
    // Ask for the first and last names of the user
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: `Employee's first name?`,
        },
        {
            type: 'input',
            name: 'last_name',
            message: `Employee's last name?`,
        }
    ]).then(answer => {
        // Parameters variable that stores their first and last name
        const parameters = [answer.first_name, answer.last_name]

        // Query to get all the roles from the db
        db.query(`SELECT * FROM roles`, (err, data) => {
            if (err) throw err;
            // Set name = title of the role and value = id that role
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            // Ask for the role of the employee with the choices as the roles pulled from the above query
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee role?',
                    choices: roles
                }
            ]).then(answer => {
                const role = answer.role;
                // Push that role to the parameters array
                parameters.push(role);

                // Query to get all the employees
                db.query(`SELECT * FROM employee`, (err, data) => {
                    if (err) throw err;
                    // Set name = concatonation of the first and last name of employee and value = id that employee
                    const employees = data.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));

                    // Ask the user which of the employees pulled from the above query is the new employee's manager
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'What is the employee manager?',
                            choices: employees
                        }
                    ]).then(answer => {
                        const manager = answer.manager;
                        // Push that manager to the parameters array
                        parameters.push(manager);

                        // Add that employee to the employee table
                        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, parameters, function (err, res) {
                            if (err) throw err;

                            // Call viewEmployees() to show all employees
                            viewEmployees();
                        });
                    });
                });
            });
        });
    });
};

// This function allows the user to update an employee's role
updateEmployee = () => {
    // Query to select all employees from employee table
    const employeemysql = `SELECT * FROM employee`;

    db.query(employeemysql, (err, data) => {
        // Set name = concatonation of first/last name and the value = the id the employee
        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        // Ask the user which employee they want to update with the employees pulled from the above query as choices
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee do you want to update the role for?',
                choices: employee
            }
        ]).then(employeeChoice => {
            const employee = employeeChoice.name;
            // Declare "parameters"
            const parameters = [];
            // Add "employee" (which is the name of the selected employee) to "parameters"
            parameters.push(employee);

            // Query that selects all roles from roles
            const role_var = `SELECT * FROM roles`;

            db.query(role_var, (err, data) => {
                if (err) return console.log(err);
                // Set the name = title of the role and value = id of the role
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                // Ask the user what the employee's new role is using the roles pulled from the above query as the options
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role?',
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;

                    // Push the selected role to "parameters"
                    parameters.push(role);

                    // Set "employee" = the first element in the parameters array
                    let employee = parameters[0]

                    // Set the first element in parameters = the new role 
                    parameters[0] = role

                    // Set the second element in parameters = the employee (swapping the order so that we can use it in the right way below)
                    parameters[1] = employee

                    // Query that will update the employee's role_id where the id = the employee's id
                    const mysql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    db.query(mysql, parameters, (err, result) => {
                        if (err) return console.log(err);
                        console.log('Role has been updated.');

                        // Display employees (and their roles) by calling viewEmployees()
                        viewEmployees();
                    });
                });
            });
        });
    });
};