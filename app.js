require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authroutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api' , authroutes);


const port = process.env.PORT || 4000;

app.listen(port , ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
