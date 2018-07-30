const User = require("../models/user");
const webpush = require('web-push');

let USER_SUBSCRIPTIONS = [];
const vapidKeys = {
    "publicKey":"BFsjeYO7F2jfDBJYF8fhGGWK1knggiFN8uxEpslVLgBw5i5VNQlPan7s-jNw-NAR4L-DQo0_YWZfov1EkCxbyHI",
    "privateKey":"wfmWi4EhI3WX62lhKdnQK36JlO0djCsAa9d88Mcds60"
};
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

exports.sendNotification = (req, res) => {
    const notificationPayload = {
        'notification': {
            'title': "an event with title "+ req.body.title +"was added",
            'body': req.body.description,
            'icon': 'assets/main-page-logo-small-hat.png',
            'vibrate': [100, 50, 100],
            'data': {
                'dateOfArrival': Date.now(),
                'primaryKey': 1
            }
        }
    };
    Promise.all(USER_SUBSCRIPTIONS.map(sub =>
         webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
        .catch(err => {
            console.log('Error sending notification, reason: ', err);
            res.sendStatus(500);
        });
}

exports.addPushSubscriber = (req, res) => {
    const sub = req.body;
    console.log('Received Subscription on the server: ', sub);
    if(USER_SUBSCRIPTIONS.indexOf(sub) === -1) {
        USER_SUBSCRIPTIONS.push(sub);
        console.log(USER_SUBSCRIPTIONS.length);
      }
    res.status(200).json({message: 'Subscription added successfully.'});
}