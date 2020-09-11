const pool = require('../models/db');

class userPassword {
    constructor(passId, passHash, createdAt, replacedAt) {
        this.passwordId = passId
        this.passwordHash = passHash;
        this.passwordCreatedAt = createdAt;
        this.passwordReplacedAt = replacedAt;
    }

    insert() {

        let pass = this;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO user_passwords (user_id, password_hash, created_at, replaced_at) VALUES (?, ?, ?, ?)', [pass.passwordId, pass.passwordHash, pass.passwordCreatedAt, pass.passwordReplacedAt], (err, results, fields) => {
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