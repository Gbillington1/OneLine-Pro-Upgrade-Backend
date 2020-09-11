require('dotenv').config();
const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_API_KEY);

// recieve get request and return session id of the transaction 
router.get('/', async (req, res) => {
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

module.exports = router;