const router = require('express').Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const User = require('../models/user');
const Token = require('../models/token');
const onelineApiError = require("../models/onelineApiError");
const pool = require('../models/db');

router.post('/', async function(req, res, next) {
    // get the user from the DB
    pool.query('SELECT * FROM users WHERE user_email = ?', [req.body.email], (err, result, fields) => {
        // if there is a user with provided email
        if (result.length > 0) {

            // create a token that expires in an hour
            let expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);

            var token = new Token(result[0].user_email, expireDate);

            // insert token into DB
            token.insert().then(() => {
                console.log("sending message");
            }).catch(err => {
                next(err) 
            });

        }

        res.send('OK').status(200);
    })
})

module.exports = router;
