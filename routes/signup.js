const router = require('express').Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const User = require('../models/user');
const onelineApiError = require("../models/onelineApiError");

// post request for 'api/v1/signup'
router.post('/', async (req, res, next) => {
    console.log("here");
    let unhashedPass = req.body.password;

    bcrypt.hash(unhashedPass, saltRounds, (err, hash) => {
        if (err) next(err);

        let userData = {
            'userId': uuidv4(),
            'userFirstName': req.body.firstName,
            'userLastName': req.body.lastName,
            'userEmail': req.body.email,
            'userPasswordHash': hash, 
            'userCreatedAt': moment().format("YYYY-MM-DD hh:mm:ss"),
        }

        let user = new User(userData.userId, userData.userFirstName, userData.userLastName, userData.userEmail, userData.userPasswordHash, userData.userCreatedAt);

        // check this error handling
        user.create().then(() => {

            res.status(200).send('User created successfully');
            
        }).catch(err => next(err));

    })

})

module.exports = router;