'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
    DATABASE_URL,
    PORT
} = require('./config');

const {
    Products
} = require('./modules/products/products.models');

const {
    Events
} = require('./modules/events/events.models');

const {
    User
} = require('./modules/users/users.models');

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/users', (req, res) => {
    User
        .find()
        .then(Users => {
            res.json(Users.map(user => user.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went horribly awry'
            });
        });
});

app.post('/users', (req, res) => {
    const requiredFields = ['email', 'password', 'firstName', 'lastName'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    User
        .create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            country: req.body.country,
            topSize: req.body.topSize,
            bottomSize: req.body.bottomSize
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went bad.......very bad'
            });
        });
});

app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Nothing here broski, move along'
    });
});

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {
    runServer,
    app,
    closeServer
};

// {
//     "email": "jonathanbeaty15@gmail.com",
//     "password": "copper00",
//     "firstName": "Jonathan",
//     "lastName": "Beaty",
//     "address": "102 Melba Dr.",
//     "city": "Portland",
//     "state": "Texas",
//     "zipCode": "78374",
//     "country": "United States",
//     "topSize": "Large",
//     "bottomSize": "Small"
// }