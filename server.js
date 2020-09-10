require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const mysql = require("mysql");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_API_KEY);
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { v4: uuidv4 } = require('uuid');
const Payment = require("./models/payment");
const Password = require("./models/userPassword");
const User = require('./models/user');
const onelineApiError = require("./models/onelineApiError");

let paymentIntent;

// enable CORS
app.use(cors())

// parses incoming request URLs
app.use(bodyParser.urlencoded());

// parses incoming JSON objects
app.use(bodyParser.json());

// data validation
app.use((req, res, next) => {

  // from signup route
  if (req.originalUrl === "/api/v1/signup") {

    let data = req.body;

    let regexToValidateEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let emailValid = regexToValidateEmail.test(String(data.email).toLowerCase());
    let passwordValid = data.password.length > 6;

    if (!emailValid || !passwordValid) {

      next(new onelineApiError(701).output());

    }
  }

});

//local 
let conn = mysql.createConnection({
  host: 'mariadb',
  user: 'user',
  password: 'test',
  database: 'oneline-db'
});

// live db
// let conn = mysql.createConnection(process.env.DATABASE_URL);

// connect to the database
conn.connect(function (err) {
  if (err) throw err;
  console.log("You are connected to the database");
})

// user sign up (before payment)
app.post('/api/v1/signup', (req, res) => {
  console.log("here");
  let unhashedPass = req.body.password;

  bcrypt.hash(unhashedPass, saltRounds, (err, hash) => {
    if (err) console.error(err);

    let userPasswordData = {
      'passwordId': uuidv4(),
      'password': hash,
      'createdAt': moment().format("YYYY-MM-DD hh:mm:ss")
    }

    let userPassword = new Password(userPasswordData.passwordId, userPasswordData.password, userPasswordData.createdAt);

    userPassword.insert(conn).catch(err => console.error(err));

    let userData = {
      'userId': uuidv4(),
      'userEmail': req.body.email,
      'userCreatedAt': moment().format("YYYY-MM-DD hh:mm:ss"),
      'userPasswordId': userPasswordData.passwordId
    }

    let user = new User(userData.userId, userData.userEmail, userData.userCreatedAt, userData.userPasswordId);

    user.insert(conn).catch(err => console.error(err));

  })

  res.status(200).send('Post req received');
})

// endpoint for logging in to a OneLine account
app.post('api/v1/login', (res, req) => {

})

// webhook endpoint for payment
app.post('/api/v1/payment-completed', bodyParser.raw({ type: 'application/json' }), function (req, res) {
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

// error handling middleware
app.use((err, req, res, next) => {

  // handle api error
  if (err.error.type == "onelineApiError") {
    console.error(err);
    res.status(err.error.status).send(err.error.message);
  } else {
    res.status(400).send("Something went wrong");
  }

});

// local
app.listen(4242, () => console.log('Node server listening on port ' + 4242));

// live
// app.listen(process.env.PORT, () => console.log('Node server listening on port ' + process.env.PORT));
