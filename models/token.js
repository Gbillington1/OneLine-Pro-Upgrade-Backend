const pool = require('../models/db');
const onelineApiError = require('./onelineApiError');
const crypto = require('crypto');
const moment = require("moment");

class Token {
    constructor(user_email, date = null) {
        this.user_email =  user_email;
        this.token = crypto.randomBytes(64).toString('base64');
        this.token_expire_date = date;
    }

    insert() {

        let token = this;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO password_tokens (user_email, token, token_expire_date) VALUES (?, ?, ?)', [token.user_email, token.token, token.token_expire_date], (err, result, fields) => {
                if (err) {
                    
                    // if token with given email already exists in DB
                    if (err.message.includes("unique_token_email")) {
                        // update the token and expiredate
                        token.update().then(() => {
                            // update values in object
                            this.token = crypto.randomBytes(64).toString('base64');

                            // set token to expire in 1 hour
                            this.token_expire_date = moment().add(1, "hours").format("YYYY-MM-DD hh:mm:ss");
                            
                            resolve();
                            
                        }).catch(err => {
                            reject(err)
                        });
                    // other error
                    } else {
                        reject(err);
                    }
                // no error
                } else {
                    resolve();
                }
            })
        })
    }

    update() {
        let token = this;

        // delete previous token 
        return new Promise((resolve, Reject) => {
            pool.query('UPDATE password_tokens SET token = ?, token_expire_date = NOW() + INTERVAL 1 HOUR WHERE user_email = ?;', [token.token, token.user_email], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    deleteExpired() {

        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM password_tokens WHERE token_expire_date < NOW()', (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    retrieve() {

        let token = this;

        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM password_tokens WHERE user_email = ?', [token.user_email], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
}

module.exports = Token;