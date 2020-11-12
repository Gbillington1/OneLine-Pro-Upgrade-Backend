const router = require('express').Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const User = require('../models/user');
const Token = require('../models/token');
const onelineApiError = require("../models/onelineApiError");
const pool = require('../models/db');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

// mailgun auth for nodemailer
let auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: 'reset.useoneline.com'
    }
  }
  
// create nodemailer + mailgun transport
let nodemailerMailgun = nodemailer.createTransport(mg(auth));

// when user clicks on "forgot password" when attempting to login 
router.post('/forgot-password', function(req, res, next) {
    // get the user from the DB
    pool.query('SELECT * FROM users WHERE user_email = ?', [req.body.email], (err, result, fields) => {
        // if there is a user with provided email
        if (result.length > 0) {

            // create a token that expires in an hour
            let expireDate = moment().add(1, 'hours').format("YYYY-MM-DD hh:mm:ss")

            var token = new Token(result[0].user_email, expireDate);

            // insert token into DB
            token.insert().then(() => {

                // create message
                const message = {
                    from: 'noreply@useoneline.com',
                    to: req.body.email,
                    subject: 'OneLine - Reset your Password',
                    text: 'To reset your password, please click the link below.\n\nhttps://useoneline.com/api/v1/forgot/reset-password?token=' + encodeURIComponent(token.token) + '&email=' + req.body.email
                }
        
                // send mail
                nodemailerMailgun.sendMail(message, (err, info) => {
                    if (err) {
                        next(err);
                    } else {
                        console.log(info)
                    }
                })

            }).catch(err => {
                next(err) 
            });

        } else {
            next(new onelineApiError(701));
        }

        res.send('OK').status(200);
    })
})

// when user clicks on the link sent to their email
router.get('/reset-password', (req, res, next) => {

    let token = new Token(req.query.email);
    token.deleteExpired().then(() => {
        token.retrieve().then((result) => {
            // if there is no token
            if (result.length < 1) {
                next(new onelineApiError(301).output())
            // there is a token 
            } else {
                // complete the token object (update the incorrect data)
                token.token = result[0].token;
                token.expireDate = JSON.stringify(result[0].token_expire_date).replace('T', ' ').substring(1, 20)
                
                res.send('Token Verified').status(200);

                // provide the user with the reset password form

            }
        })

    }).catch(err => next(err));
})

// when user submits the new password(s)
router.post('/reset-password', (req, res, next) => {
    let data = req.body;

    // passwords don't match OR password isn't long enough
    if (data.password1 !== data.password2 || !data.password1.length >= 6) {
        next(new onelineApiError(701).output())
    } else {

        // verify the token
        let token = new Token(data.email);
        token.deleteExpired().then(() => {
            token.retrieve().then((result) => {
                // if there is no token
                if (result.length < 1) {
                    next(new onelineApiError(301).output())
                // token is verified 
                } else {
                    // complete the token object (update the incorrect data)
                    token.token = result[0].token;lakjsdhflksjahlfkjhdlask
                    token.expireDate = JSON.stringify(result[0].token_expire_date).replace('T', ' ').substring(1, 20)
                    
                    // get user
                    pool.query('SELECT * FROM users WHERE user_email = ?', [data.email], async function(err, result, fields) {
                        // user doesn't exist in DB
                        if (result.length < 1) {
                            next(new onelineApiError(701));
                        // user exists
                        } else {
                            // make user obj 
                            let userData = result[0];

                            let user = new User(userData.user_id, userData.user_first_name, userData.user_last_name, userData.user_email, userData.user_password_hash, userData.created_at)

                            // check new pass and pass in DB
                            bcrypt.compare(data.password1, userData.user_password_hash, (err, result) => {
                                // if passwords are the same throw an error
                                if (result == true) {
                                    next(new onelineApiError(701));
                                // if passwords are not the same
                                } else {
                                    
                                    // hash the new password
                                    bcrypt.hash(data.password1, 11, (err, hash) => {
                                        if (err) {next(err)}
                                        // update hash in user obj
                                        user.userPasswordHash = hash;

                                        // update the user in the DB
                                        user.update(user.userFirstName, user.userLastName, user.userEmail, user.userPasswordHash).then(() => {
                                            res.send('Updated password').status(200);
                                        }).catch(err => {next(err)});
                                    })
                                }
                            })
                        }
                    })
                }
            })
    
        }).catch(err => next(err));

        // give the user a way to login
    }
})

module.exports = router;
