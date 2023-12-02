const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const app = express();
const port = 3000; // Change this to your desired port

// Create connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // If there's no password, leave this empty
    database: 'course_registration',
    connectionLimit: 10
});


// Middleware to parse JSON body
app.use(bodyParser.json());

// API endpoint to register online course
app.post('/register-course', (req, res) => {
    try {
        const {
            name,
            college_name,
            year_of_studies,
            phone_number,
            mail_id,
            course_name,
            time_slot,
            course_duration
        } = req.body;

        pool.query(
            'INSERT INTO OnlineCourses (name, college_name, year_of_studies, phone_number, mail_id, course_name, time_slot, course_duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, college_name, year_of_studies, phone_number, mail_id, course_name, time_slot, course_duration],
            (error, results) => {
                if (error) {

                    res.status(500).json({ error: 'Error registering course', message: error });
                } else {
                    res.status(200).json({ message: 'Course registered successfully', results: results });
                }
            }
        );
    }
    catch (err) {
        res.status(500).json({ error: 'Error registering course', message: err });
    }
});

// API endpoint to fetch all registered courses
app.post('/getCourses', (req, res) => {
    try {
        const user_name = req.body.user_name;
        const password = req.body.password;
        if (user_name == "betterAdmin" && password == "beTTer@7005") {
            pool.query('SELECT * FROM OnlineCourses', (error, results) => {
                if (error) {
                    res.status(500).json({ error: 'Error fetching courses' });
                } else {
                    res.status(200).json({ courses: results });
                }
            });
        }
        else {
            res.status(500).json({ error: 'Credential incorrect' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

app.post('/getCoursesCSV', (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;

    try {

        if (user_name === "betterAdmin" && password === "beTTer@7005") {
            pool.query('SELECT * FROM OnlineCourses', (error, results) => {
                if (error) {
                    res.status(500).json({ error: 'Error fetching courses' });
                } else {
                    const csvWriter = createCsvWriter({
                        path: 'courses_report.csv',
                        header: [
                            { id: 'id', title: 'ID' },
                            { id: 'name', title: 'Name' },
                            { id: 'college_name', title: 'College Name' },
                            { id: 'year_of_studies', title: 'Year of Studies' },
                            { id: 'phone_number', title: 'Phone Number' },
                            { id: 'mail_id', title: 'Mail ID' },
                            { id: 'course_name', title: 'Course Name' },
                            { id: 'time_slot', title: 'Time Slot' },
                            { id: 'course_duration', title: 'Course Duration' }
                            // Add more columns as needed
                        ]
                    });

                    csvWriter.writeRecords(results)
                        .then(() => {
                            console.log('CSV report created successfully');
                            res.download('courses_report.csv');
                        })
                        .catch(err => {
                            console.error('Error creating CSV report:', err);
                            res.status(500).json({ error: 'Error creating CSV report' });
                        });
                }
            });
        } else {
            res.status(500).json({ error: 'Credential incorrect' });
        }
    }
    catch (err) {
        console.error('Error creating CSV report:', err);
        res.status(500).json({ error: 'Error creating CSV report' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
