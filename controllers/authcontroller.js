require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


// Registration functionality
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: `Please Provide username and password` });
    }

    // check whether the user exists or not
    User.findByEmail(email, (err, result) => {
        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        };

        // hashing the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;

            const newUser = { username, email, password: hashedPassword };

            // if user doesn't exists create a newUser
            User.create(newUser, (err, result) => {
                if (err) throw err;

                res.status(201).json({ message: 'User Successfully Registered' });
            });
        });
    });

};


// login Functionality

exports.login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: `Please Provide email and password` });
    }

    User.findByEmail(email, (err, result) => {

        if (result.length == 0) {
            return res.status(400).json({ message: `Invalid email or password` });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {

            if (err) throw err

            if (!isMatch) {
                return res.status(400).json({ message: `Invalid email or password` });
            }

            // generating a token for the user
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '1h'
            });

            res.json({ token });
        });
    });
};

// profile
exports.getProfile = (req, res) => {

    const userId = req.user.id;

    User.findById(userId, (err, result) => {
        if (err) throw err;

        if(result.length == 0){
            return res.status(404).json({message:'User Not Found.'})
        }

        res.json(result[0]);
    });
};

