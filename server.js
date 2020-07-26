const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const { resolve } = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_API_KEY);

// enable CORS
app.use(cors({
  origin: 'http://localhost:3000'
}))

// form connection object
var connection = mysql.createConnection(process.env.DATABASE_URL);

// connect to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("You are connected to the database");
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'test.html'));
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

app.listen(process.env.PORT, () => console.log('Node server listening on oneline-backend.herokuapp.com'));
