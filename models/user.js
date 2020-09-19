const pool = require('../models/db');
const onelineApiError = require('./onelineApiError');

class User {
    constructor(id, firstName, lastName, email, createdAt) {
        this.userId = id;
        this.userFirstName = firstName;
        this.userLastName = lastName;
        this.userEmail = email;
        this.userCreatedAt = createdAt;
    }

    insert() {

        let user = this;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (user_id, user_first_name, user_last_name, user_email, created_at) VALUES (?, ?, ?, ?, ?)', [user.userId, user.userFirstName, user.userLastName, user.userEmail, user.userCreatedAt], (err, result, fields) => {
                if (err) {
                    // if email already exists in DB
                    if (err.message.includes("unique_email_constraint")) {
                        reject(new onelineApiError(702).output());
                    } else {
                        reject(err);
                    }

                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = User;