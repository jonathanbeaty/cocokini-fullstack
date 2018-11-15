'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var dotenv = require('dotenv');
var Auth0Strategy = require('passport-auth0');
var session = require('express-session');
var passport = require('passport');
var userInViews = require('./lib/middleware/userInViews');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;

dotenv.load();

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

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const jsonParser = bodyParser.json();
const app = express();

app.use(express.static('public'))

app.use(morgan('common'));
app.use(express.json());

app.use(cookieParser());

app.use(flash());

var sess = {
    secret: 'jb12345',
    cookie: {},
    resave: true,
    saveUninitialized: true
};

if (app.get('env') === 'production') {
    sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(function (req, res, next) {
    if (req && req.query && req.query.error) {
        req.flash('error', req.query.error);
    }
    if (req && req.query && req.query.error_description) {
        req.flash('error_description', req.query.error_description);
    }
    next();
});

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);

// app.get('/callback',
//     passport.authenticate('auth0', {
//         failureRedirect: '/login'
//     }),
//     function (req, res) {
//         if (!req.user) {
//             throw new Error('user null');
//         }
//         res.redirect("/");
//     }
// );

// app.get('/login',
//     passport.authenticate('auth0', {}),
//     function (req, res) {
//         res.redirect("/");
//     });

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

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

app.get('/events', (req, res) => {
    Events
        .find()
        .then(Events => {
            res.json(Events.map(event => event.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went horribly awry'
            });
        });
});

app.get('/products', (req, res) => {
    Products
        .find()
        .then(Products => {
            res.json(Products.map(product => product.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went horribly awry'
            });
        });
});

app.post('/users', (req, res) => {
    const requiredFields = ['email', 'password'];
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
            profile: {
                firstName: req.body.profile.firstName,
                lastName: req.body.profile.lastName,
                location: {
                    address: req.body.profile.location.address,
                    city: req.body.profile.location.city,
                    state: req.body.profile.location.state,
                    zipCode: req.body.profile.location.zipCode,
                    country: req.body.profile.location.country
                }
            },
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

app.post('/events', (req, res) => {
    const requiredFields = ['event', 'location', 'date'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Events
        .create({
            event: req.body.event,
            location: req.body.location,
            date: req.body.date,
            picture: {
                url: req.body.picture.url,
                altText: req.body.picture.altText
            }
        })
        .then(event => res.status(201).json(event.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went bad.......very bad'
            });
        });
});

app.post('/products', (req, res) => {
    const requiredFields = ['style', 'name', 'sizes'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Products
        .create({
            style: req.body.style,
            name: req.body.name,
            sizes: req.body.sizes,
            fabrics: req.body.fabrics,
            picture: {
                url: req.body.picture.url,
                altText: req.body.picture.altText
            },
            pictures: [{
                url: req.body.pictures.url,
                order: req.body.pictures.order,
                altText: req.body.pictures.altText
            }],
            page: req.body.page,
            created: req.body.created
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went bad.......very bad'
            });
        });
});

app.put('/users/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toUpdate = {};
    const updateableFields = ['email', 'profile', 'password', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country', 'topSize', 'bottomSize'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    console.log(toUpdate);

    User
        .findByIdAndUpdate(req.params.id, {
                $set: toUpdate
            },
            User.findOne({
                _id: req.params.id
            }).then(function (User) {
                res.send(User)
            })
        )
        .then(updatedUser => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.put('/events/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toUpdate = {};
    const updateableFields = ['event', 'location', 'date', 'picture', 'url', 'altText'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    console.log(toUpdate);

    Events
        .findByIdAndUpdate(req.params.id, {
                $set: toUpdate
            },
            User.findOne({
                _id: req.params.id
            }).then(function (User) {
                res.send(User)
            })
        )
        .then(updatedEvent => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.put('/products/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }

    const toUpdate = {};
    const updateableFields = ['style', 'name', 'sizes', 'fabrics', 'pictures', 'url', 'order', 'altText', 'picture', 'url', 'page', 'created'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    console.log(toUpdate);

    Products
        .findByIdAndUpdate(req.params.id, {
                $set: toUpdate
            },
            User.findOne({
                _id: req.params.id
            }).then(function (User) {
                res.send(User)
            })
        )
        .then(updatedProduct => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.delete('/users/:id', (req, res) => {
    User
        .findByIdAndDelete(req.params.id)
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.delete('/events/:id', (req, res) => {
    Events
        .findByIdAndDelete(req.params.id)
        .then(event => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.delete('/products/:id', (req, res) => {
    Products
        .findByIdAndDelete(req.params.id)
        .then(Products => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Internal server error'
        }));
});

app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Nothing here broski, move along'
    });
});

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, {
            useNewUrlParser: true
        }, err => {
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
//     "email": "laurenelizabethpage24@gmail.com",
//     "password": "cocokinimytini",
//     "profile": {
//     	"firstName": "Lauren",
//     	"lastName": "Page",
//     	"location": {
//     		"address": "209 West Utica St.",
//     		"city": "Portland",
//     		"state": "Oregon",
//     		"zipCode": "65400",
//     		"country": "United States"
//     	}
//     },
//     "topSize": "Large",
//     "bottomSize": "Small"
// }


// {
//     "style": "Top",
//     "name": "Matapalo",
//     "sizes": ["Large", "Medium", "Small"],
//     "fabrics": ["Cheetah", "Leopard Skin", "Sunrise"],
//     "picture": {
//     	"url": "https://c1.staticflickr.com/1/783/27741643448_c47e6a4d5f_b.jpg",
//     	"altText": "Kauai"
//     },
//     "pictures": {
//     	"url": "https://c1.staticflickr.com/1/823/28133304198_ef1091b17d_b.jpg",
//     	"order": 1,
//     	"altText": "Beach Time"
//     },
//     "page": "Home"
// }

// {
//     "event": "Island Farmers Market - On the Island",
//     "location": "Padre Island",
//     "date": "March 23, 2019",
//     "picture": {
//         "url": "https://c1.staticflickr.com/1/961/26918910337_9c2fa22c2e_b.jpg",
//         "altText": "Octoberfest"
//     }
// }