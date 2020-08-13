class Session {

    constructor(session_id, customer_id, payment_id) {
        this.session_id = session_id;
        this.customer_id = customer_id;
        this.payment_id = payment_id;
    }

    insert(conn) {
        let session = this;
        return new Promise(function(resolve, reject) {
            conn.query('INSERT INTO sessions (session_id, customer_id, payment_id) VALUES (?, ?, ?)', [session.session_id, session.customer_id, session.payment_id], function(err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }
}

module.exports = Session;


