'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const mocha = require('mocha');

var expect = chai.expect;
chai.should();

const {
    frontPageSlider,
    localFavoritesImg,
    upcomingEvents,
    productsOverview,
    productPage
} = require('./modules/content/content.models');

const {
    admin
} = require('./modules/admin/admin.models');

const {
    Users
} = require('./modules/users/users.models');

const {
    app,
    runServer,
    closeServer
} = require('../server');

const {
    TEST_DATABASE_URL,
    PORT
} = require('./config');

chai.use(chaiHttp);