require('dotenv').config();
const app = require("express")();

// routes
const signUp = require('./routes/signup');
const login = require('./routes/login');
const payment = require('./routes/payment');
const createStripeSession = require('./routes/createStripeSession');

// packages
const cors = require("cors");
const bodyParser = require("body-parser");

// models
const onelineApiError = require("./models/onelineApiError");

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
    let passwordValid = data.password.length >= 6;

    // if email or password is invalid, throw an error
    if (!emailValid || !passwordValid) {

      next(new onelineApiError(701).output());

    }
  } 

  next();

});

// user sign up route (before payment)
app.use('/api/v1/signup', signUp);

// user login route
// app.use('api/v1/login', login);

// payment route
app.use('/api/v1/payment-completed', payment)

// create stripe session
app.use('/id', createStripeSession);

// error handling middleware
app.use((err, req, res, next) => {
  // console.log(err)

  // handle api error
  if (err.error && err.error.type == "onelineApiError") {

    console.error(err);
    res.status(err.error.status).send(err.error.message);

  } else {
    // handle non api error
    console.error(err);
    res.status(400).send("Something went wrong");

  }

});

// local
app.listen(4242, () => console.log('Node server listening on port ' + 4242));

// live
// app.listen(process.env.PORT, () => console.log('Node server listening on port ' + process.env.PORT));
