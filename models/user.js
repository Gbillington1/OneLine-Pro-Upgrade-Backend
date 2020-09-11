const pool = require('../models/db');

class User {
    constructor(id, firstName, lastName, email, createdAt, paymentId) {
        this.userId = id;
        this.userFirstName = firstName;
        this.userLastName = lastName;
        this.userEmail = email;
        this.userCreatedAt = createdAt;
        this.userPaymentId = paymentId;
    }

    insert() {

        let user = this;

        console.log(user);

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO users (user_id, user_first_name, user_last_name, user_email, created_at, payment_id) VALUES (?, ?, ?, ?, ?, ?)', [user.userId, user.userFirstName, user.userLastName, user.userEmail, user.userCreatedAt, user.userPaymentId], (err, result, fields) => {
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