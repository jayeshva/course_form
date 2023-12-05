const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const Courseforms = require('./controllers/courseReg');


const app = express();
const port = 3000; // Change this to your desired port


app.use(bodyParser.json());

app.use('/forms', Courseforms);



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
