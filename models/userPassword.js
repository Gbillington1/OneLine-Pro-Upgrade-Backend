class userPassword {
    constructor(passId, passHash, timestamp) {
        this.passwordId = passId
        this.passwordHash = passHash;
        this.passwordCreatedAt = timestamp;
    }

    insert(conn) {

        let pass = this;

        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO user_passwords (password_id, password_hash, password_created_at) VALUES (?, ?, ?)', [pass.passwordId, pass.passwordHash, pass.passwordCreatedAt], (err, results, fields) => {
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