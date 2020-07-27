class Payment {
    constructor(payment_id, payment_amount, payment_currency, stripe_fee, payment_timestamp, customer_id) {
        this.paymentId = payment_id;
        this.paymen_amount = payment_amount;
        this.currency = payment_currency;
        this.fee = stripe_fee;
        this.payment_timestamp = payment_timestamp;
        this.customerId = customer_id;
    }

    test() {
        console.log("The test worked!")
    }
}

module.exports = Payment;