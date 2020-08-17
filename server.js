// require('dotenv').config();
console.log(process.env)
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const mysql = require("mysql");
const { resolve } = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_API_KEY);
const Payment = require("./models/payment");
const Session = require("./models/session");

let paymentIntent;

// enable CORS
app.use(cors())

// schema migrations for schema creation
// flyway

//local db
let conn = mysql.createConnection({
  host: 'mariadb',
  user: 'user',
  password: 'test',
  database: 'oneline-db'
});

// live db
// let conn = mysql.createConnection(process.env.DATABASE_URL);

// connect to the database
conn.connect(function(err) {
  if (err) throw err;
  console.log("You are connected to the database");
})

app.post('/payment-completed', bodyParser.raw({type: 'application/json'}), function(req, res) {
  let webhook;

  try {
    webhook = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (webhook.type) {

    case "checkout.session.completed":
      let sessionData = webhook.data.object;

      let session = new Session(sessionData.id, sessionData.customer, sessionData.payment_intent);
      session.insert(conn).catch(err => console.error(err));

      break;

    case "customer.created":
      let customerData = webhook;
      let customerTimestamp = moment.unix(customerData.created).format("YYYY-MM-DD hh:mm:ss");


      break;

    case "payment_intent.succeeded":
      let paymentData = webhook.data.object;
      let PaymentTimestamp = moment.unix(paymentData.created).format("YYYY-MM-DD hh:mm:ss");

      paymentIntent = new Payment(paymentData.id, paymentData.amount, paymentData.currency, PaymentTimestamp, paymentData.payment_method, paymentData.status, paymentData.customer);

      paymentIntent.insert(conn).catch(err => console.error(err));

      break;

    default:
      break;

  }
  res.status(200).send(paymentIntent);
})

// recieve get request and return session id of the transaction 
app.get('/id', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'OneLine-Pro',
        },
        unit_amount: 500,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/thankyou?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/upgrade',
  });
  res.json({ session_id: session.id });
});

// local
app.listen(4242, () => console.log('Node server listening on port ' + 4242));

// live
// app.listen(process.env.PORT, () => console.log('Node server listening on port ' + process.env.PORT));
