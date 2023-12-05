const mysql = require('mysql2');

const pool = mysql.createConnection({
    host: 'localhost',
    user: 'thebette_forms_app',
    password: 'Better@7005', // If there's no password, leave this empty
    database: 'thebette_forms',
    port:3306
});

// const pool = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '', // If there's no password, leave this empty
//     database: 'course_registration',
//     connectionLimit: 10
// });

pool.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return; 
    }
    console.log('Connected to database');
  
    // SQL command to create the table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

     // SQL command to create the user table
  const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS OnlineCourses (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    mail_id VARCHAR(255) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    year_of_studies YEAR NOT NULL, 
    course_duration VARCHAR(255) NOT NULL,
    time_slot VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  ) 
`;
  
    // Execute the SQL command to create the subscribers table
    pool.query(createTableQuery, (error, results, fields) => {
      if (error) { 
        console.error('Error creating table:', error);
      }
      else if (results.warningStatus === 0) {
        console.log('Table created for subscribers list successfully');
      }
       
    });

    // Execute the SQL command to create the course registration table
    pool.query(createUserTableQuery, (error, results, fields) => {
      if (error) { 
        console.error('Error creating table:', error);
      }
      else if (results.warningStatus === 0) {
        console.log('Table created for course registration successfully');
      }
       
    });
  });

module.exports = pool; 