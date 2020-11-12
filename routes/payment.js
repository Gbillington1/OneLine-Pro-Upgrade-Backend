const router = require('express').Router();
const Payment = require('../models/payment');
const moment = require('moment');

// receives webhook
router.post('/', (req, res) => {
    console.log(req.body.type)
    let webhook = req.body;

    // try {
    //     webhook = JSON.parse(req.body);
    // } catch (err) {
    //     res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    switch (webhook.type) {
        // doesn't add to production database
        case "payment_intent.succeeded":

            let paymentData = webhook.data.object;
            let PaymentTimestamp = moment.unix(paymentData.created).format("YYYY-MM-DD hh:mm:ss");

            paymentIntent = new Payment(paymentData.id, paymentData.amount, paymentData.currency, PaymentTimestamp, paymentData.payment_method, paymentData.status, paymentData.customer);

            paymentIntent.insert().catch(err => {console.error(err)});

            break;

        default:
            break;

    }
    res.status(200).send(webhook);
});

module.exports = router;