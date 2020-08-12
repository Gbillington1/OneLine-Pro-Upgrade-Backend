require('dotenv').config();
console.log(process.env)
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const mysql = require("mysql");
const { resolve } = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_API_KEY);
const Payment = require("./models/payment.js");

var paymentIntent;

// enable CORS
app.use(cors())

// schema migrations for schema creation
// flyway

// local db
// var conn = mysql.createConnection({
//   host: 'mariadb',
//   user: 'user',
//   password: 'test',
//   database: 'oneline-db'
// });

// live db
var conn = mysql.createConnection({process.env.DATABASE_URL);

// connect to the database
conn.connect(function(err) {
  if (err) throw err;
  console.log("You are connected to the database");
})

app.post('/payment-completed', bodyParser.raw({type: 'application/json'}), function(req, res) {
  var webhook;

  try {
    webhook = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (webhook.type) {

    case "checkout.session.completed":
      console.log(webhook);
      break;

    case "customer.created":
      var data = webhook;
      console.log(data)
      break;

    case "payment_intent.succeeded":

      var data = webhook.data.object;
      var timestamp = moment.unix(data.created).format("YYYY-MM-DD hh:mm:ss");
      paymentIntent = new Payment(data.id, data.amount, data.currency, timestamp, data.customer);
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

app.listen(4242, () => console.log('Node server listening on port ' + 4242));
