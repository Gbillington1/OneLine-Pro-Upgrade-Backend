const pool = require('../models/db');
const onelineApiError = require('./onelineApiError');
const crypto = require('crypto');
const { resolve } = require('path');
const { nextTick } = require('process');

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
                    
                    // if token already exists in DB
                    if (err.message.includes("unique_token_email")) {
                        // reset the token
                        token.reset().then(() => {
                            this.token = crypto.randomBytes(64).toString('base64');
                            // set token to expire in 1 hour
                            this.token_expire_date = new Date();
                            this.token_expire_date.setHours(this.token_expire_date.getHours() + 1);
                            
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

    reset() {
        let token = this;

        // delete previous token 
        return new Promise((resolve, Reject) => {
            pool.query('DELETE FROM password_tokens WHERE user_email = ?', [this.user_email], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    pool.query('INSERT INTO password_tokens (user_email, token, token_expire_date) VALUES (?, ?, ?)', [token.user_email, token.token, token.token_expire_date], (err, result, fields) => {
                        if (err) {
    
                            reject(err);
        
                        } else {
                            resolve();
                        }
                    })
                }
            })
        })
    }

    delete() {

        let token = this;

        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM password_tokens WHERE user_email = ?', [this.user_email], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = Token;