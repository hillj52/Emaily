const mongoose = require('mongoose');
const { Path } = require('path-parser');
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const _ = require('lodash');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for responding!');
    });

    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });
        res.send(surveys);
    });

    app.get('/api/survey/totals/:surveyId', requireLogin, async (req, res) => {
        const survey = await Survey.findOne({ _user: req.user.id, _id: req.params.surveyId });
        if (!req.user.id === survey._id) {
            res.status(401).send({ error: 'User does not have access to that survey' });
        }
        const data = { surveyId: req.params.surveyId, yes: 0, no: 0, total: 0 };
        _.each(survey.recipients, recipient => {
            data[recipient.response] += 1;
            data.total++;
        });
        res.send(data);
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

        _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact()
            .uniqBy('email', 'surveyId', 'choice')
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email }
                    }
                },{
                    $set: { 
                        'recipients.$.responded': true,
                        'recipients.$.response': choice,
                        lastResponded: Date.now() 
                    }
                }).exec();
            })
            .value();
        
        res.send({});
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        });

        const mailer = new Mailer(survey, surveyTemplate(survey));
        
        try {
            const mailerResponse = await mailer.send();
            const dbResponse = await survey.save();
            req.user.credits -= 1;
            const updatedUser = await req.user.save();

            res.send(updatedUser);
        } catch (err) {
            res.status(422).send(err);
        }
    });
}