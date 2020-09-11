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
        // do i need to `next()` this error?
        if (err) console.error(err);

        let userPasswordData = {
            'passwordId': uuidv4(),
            'password': hash,
            // 'createdAt': moment().format("YYYY-MM-DD hh:mm:ss"),
            'createdAt': null,
            'replacedAt': null
        }

        let userPassword = new Password(userPasswordData.passwordId, userPasswordData.password, userPasswordData.createdAt, userPasswordData.replacedAt);

        userPassword.insert().catch(err => next(err));

        let userData = {
            'userId': uuidv4(),
            'userFirstName': req.body.firstName,
            'userLastName': req.body.lastName,
            'userEmail': req.body.email,
            'userCreatedAt': moment().format("YYYY-MM-DD hh:mm:ss"),
            'userPasswordId': userPasswordData.passwordId
        }

        let user = new User(userData.userId, userData.userFirstName, userData.userLastName, userData.userEmail, userData.userCreatedAt, userData.userPasswordId);

        user.insert().catch(err => next(err));

    })

    res.status(200).send('Post req received');
})

module.exports = router;