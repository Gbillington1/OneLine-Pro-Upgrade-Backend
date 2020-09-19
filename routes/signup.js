const router = require('express').Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const Password = require("../models/userPassword");
const User = require('../models/user');
const onelineApiError = require("../models/onelineApiError");

// post request for 'api/v1/signup'
router.post('/', (req, res, next) => {
    console.log("here");
    let unhashedPass = req.body.password;

    bcrypt.hash(unhashedPass, saltRounds, (err, hash) => {
        if (err) next(err);

        let userData = {
            'userId': uuidv4(),
            'userFirstName': req.body.firstName,
            'userLastName': req.body.lastName,
            'userEmail': req.body.email,
            'userCreatedAt': moment().format("YYYY-MM-DD hh:mm:ss"),
        }

        let user = new User(userData.userId, userData.userFirstName, userData.userLastName, userData.userEmail, userData.userCreatedAt);

        user.insert().then(() => {

            let userPasswordData = {
                'userPasswordId': uuidv4(),
                'userPasswordHash': hash,
                'userId': userData.userId,
                'createdAt': moment().format("YYYY-MM-DD hh:mm:ss"),
                'replacedAt': null
            }

            let userPassword = new Password(userPasswordData.userPasswordId, userPasswordData.userPasswordHash, userPasswordData.userId, userPasswordData.createdAt, userPasswordData.replacedAt);

            userPassword.insert().catch(err => next(err))

        }).then(() => {

            // user created with no errors
            res.status(200).send('User created successfully');

        }).catch(err => next(err))


    })

})

module.exports = router;