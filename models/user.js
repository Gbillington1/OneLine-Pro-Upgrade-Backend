class User {
    constructor(id, email, createdAt, passwordId) {
        this.userId = id;
        this.userEmail = email;
        this.userCreatedAt = createdAt;
        this.userPasswordId = passwordId;
    }

    insert(conn) {

        let user = this;

        return new Promise((resolve, reject) => {
            conn.query('INSERT INTO users (user_id, user_email, user_created_at, user_password_id) VALUES (?, ?, ?, ?)', [user.userId, user.userEmail, user.userCreatedAt, user.userPasswordId], (err, result, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = User;