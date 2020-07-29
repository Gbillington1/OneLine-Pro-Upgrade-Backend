class Payment {
    constructor(payment_id, payment_amount, payment_currency, payment_timestamp, customer_id) {
        this.paymentId = payment_id;
        this.payment_amount = payment_amount;
        this.payment_currency = payment_currency;
        this.payment_timestamp = payment_timestamp;
        this.customerId = customer_id;
    }

    insert(conn) {
        let payment = this;
        return new Promise(function (resolve, reject) {
            conn.query("INSERT INTO payments (payment_id, payment_amount, payment_currency, payment_timestamp, customer_id) VALUES ('" + payment.paymentId + "', '" + payment.payment_amount + "', '" + payment.payment_currency + "', '" + payment.payment_timestamp + "', '" + payment.customerId + "')", function(err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
}

module.exports = Payment;