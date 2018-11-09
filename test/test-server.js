'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const mocha = require('mocha');

var expect = chai.expect;
chai.should();

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

module.exports = {
    runServer,
    app,
    closeServer
};

chai.use(chaiHttp);