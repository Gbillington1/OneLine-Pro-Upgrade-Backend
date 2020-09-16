const pool = require('../models/db');

class userPassword {
    constructor(passId, passHash, userId, createdAt, replacedAt) {
        this.userPasswordId = passId
        this.userPasswordHash = passHash;
        this.userId = userId;
        this.userPasswordCreatedAt = createdAt;
        this.userPasswordReplacedAt = replacedAt;
    }

    insert() {

        let pass = this;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO user_passwords (user_password_id, user_password_hash, user_id, created_at, replaced_at) VALUES (?, ?, ?, ?, ?)', [pass.userPasswordId, pass.userPasswordHash, pass.userId, pass.userPasswordCreatedAt, pass.userPasswordReplacedAt], (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = userPassword;