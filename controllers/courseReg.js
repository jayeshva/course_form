var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const pool = require('./config');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res, next) {
    res.json({ message: 'Welcome to the course BT API' });
});

// API endpoint to register online course
router.post('/register-course', (req, res) => {
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
router.post('/getCourses', (req, res) => {
    try {
        const user_name = req.body.user_name;
        const password = req.body.password;
        if (user_name == "betterAdmin" && password == "beTTer@7005") {
            pool.query('SELECT * FROM OnlineCourses', (error, results) => {
                if (error) {
                    res.status(500).json({ error: 'Error fetching courses' });
                } else {
                    if (results.length > 0) {
                        return res.status(200).json({ registered_count:results.length ,message: 'Courses fetched successfully',courses: results });
                    }
                    return res.status(200).json({ registered_count:0 ,message: 'Courses fetched successfully',courses: results });
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

// API endpoint to fetch all registered courses in CSV format
router.post('/getCoursesCSV', (req, res) => {
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

// API endpoint to post subscribe email
router.post('/subscribe', (req, res) => {
    try {
        const {
            user_email
        } = req.body;

        pool.query(
            'INSERT INTO Subscribers (email) VALUES (?)',
            [user_email],
            (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                    res.status(500).json({ message: 'Email already exists in subscribers list', error: error });
                    }
                    else {
                        res.status(500).json({ message: 'Error subscribing', error: error });
                    }
                } else {
                    res.status(200).json({ message: 'Subscribed successfully', results: results });
                }
            }
        );
    }
    catch (err) {
        res.status(500).json({ error: 'Error subscribing', message: err });
    }
});

// API endpoint to fetch all subscribed emails
router.post('/getSubscribers', (req, res) => {
    try {
        const user_name = req.body.user_name;
        const password = req.body.password;
        if (user_name == "betterAdmin" && password == "beTTer@7005") {
            pool.query('SELECT * FROM Subscribers', (error, results) => {
                if (error) {
                    res.status(500).json({ error: 'Error fetching subscribers' });
                } else {
                    if (results.length > 0) {
                        return res.status(200).json({ subscribed_count:results.length ,message: 'Subscribers fetched successfully',subscribers: results });
                    }
                    return res.status(200).json({ subscribed_count:0 ,message: 'Subscribers fetched successfully',subscribers: results });
                }
            });
        }
        else {
            res.status(500).json({ error: 'Credential incorrect' });
        }
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching subscribers' });
    }
});

// API endpoint to fetch all subscribed emails in CSV format
router.post('/getSubscribersCSV', (req, res) => {
    const user_name = req.body.user_name;
    const password = req.body.password;

    try {

        if (user_name === "betterAdmin" && password === "beTTer@7005") {
            pool.query('SELECT * FROM Subscribers', (error, results) => {
                if (error) {
                    res.status(500).json({ error: 'Error fetching subscribers' });
                } else {
                    const csvWriter = createCsvWriter({
                        path: 'subscribers_report.csv',
                        header: [
                            { id: 'id', title: 'ID' },
                            { id: 'email', title: 'Email' }
                            // Add more columns as needed
                        ]
                    });

                    csvWriter.writeRecords(results)
                        .then(() => {
                            console.log('CSV report created successfully');
                            res.download('subscribers_report.csv');
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


module.exports = router;