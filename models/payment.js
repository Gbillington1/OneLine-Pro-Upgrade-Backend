class Payment {
    constructor(payment_id, payment_amount, payment_currency, payment_timestamp, customer_id) {
        this.paymentId = payment_id;
        this.payment_amount = payment_amount;
        this.payment_currency = payment_currency;
        this.payment_timestamp = payment_timestamp;
        this.customerId = customer_id;
    }

    insert(conn) {
        console.log(this.paymentId)
        return new Promise(function(resolve, reject) {
            conn.query("INSERT INTO payments (payment_id, payment_amount, payment_currency, payment_timestamp, customer_id VALUES ('"+this.paymentId+"', '"+this.payment_amount+"', '"+this.payment_currency+"', '"+this.payment_timestamp+"', '"+this.customerId+"')").then(() => {
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
        })
    }
}

module.exports = Payment;