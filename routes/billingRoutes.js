const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    app.post('/api/stripe', requireLogin, async (req, res) => {
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 Emaily credits',
            source: req.body.id
        });
        //Should be checking that the charge was succesful?
        req.user.credits += 5;
        const updatedUser = await req.user.save();
        res.send(updatedUser);
    });
}