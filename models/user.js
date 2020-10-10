const pool = require('../models/db');
const onelineApiError = require('./onelineApiError');

class User {
    constructor(id, firstName, lastName, email, hash, createdAt) {
        this.userId = id;
        this.userFirstName = firstName;
        this.userLastName = lastName;
        this.userEmail = email;
        this.userPasswordHash = hash;
        this.userCreatedAt = createdAt;
    }

    create() {

        let user = this;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (user_id, user_first_name, user_last_name, user_email, user_password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)', [user.userId, user.userFirstName, user.userLastName, user.userEmail, user.userPasswordHash, user.userCreatedAt], (err, result, fields) => {
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

    update(firstName = this.userFirstName, lastName = this.userLastName, email = this.userEmail, hash = this.userPasswordHash) {

        let user = this;

        return new Promise((resolve, reject) => {
            pool.query('UPDATE users SET user_first_name = ?, user_last_name = ? , user_email = ?, user_password_hash = ? WHERE user_id = ?', [firstName, lastName, email, hash, user.userId], (err, result, fields) => {
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

    // retrieve(email) {
    //     return new Promise((resolve, reject) => {
    //         pool.query('SELECT * FROM users WHERE user_email = ?', [email], (err, result, fields) => {
    //             if (err) console.error(err);
    //             console.log(result);
    //         })
    //     })
    // }
}

module.exports = User;