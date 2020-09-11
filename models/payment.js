const pool = require('../models/db');

class Payment {
    constructor(payment_id, payment_amount, payment_currency, payment_timestamp, payment_method_id, payment_status) {
        this.payment_id = payment_id;
        this.payment_amount = payment_amount;
        this.payment_currency = payment_currency;
        this.payment_timestamp = payment_timestamp;
        this.payment_method_id = payment_method_id;
        this.payment_status = payment_status
    }

    insert() {
        let payment = this;
        return new Promise(function (resolve, reject) {
            pool.query("INSERT INTO payments (payment_id, payment_amount, payment_currency, payment_timestamp, payment_method_id, payment_status) VALUES (?, ?, ?, ?, ?, ?)", [payment.payment_id, payment.payment_amount, payment.payment_currency, payment.payment_timestamp, payment.payment_method_id, payment.payment_status], function(err, result, fields) {
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