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
    TEST_DATABASE_URL,
    PORT
} = require('../config');

const {
    Products
} = require('../modules/products/products.models');

const {
    Events
} = require('../modules/events/events.models');

const {
    User
} = require('../modules/users/users.models');

const {
    app,
    runServer,
    closeServer
} = require('../server');

chai.use(chaiHttp);

function seedProductsData() {
    let productsData = [];
    for (let i = 0; i < 10; i++) {
        productsData.push(createProductsData());
    }
    return Products.insertMany(productsData);
}

function createProductsData() {
    return {

        style: faker.random.word(),
        name: faker.random.word(),
        sizes: [faker.random.word(), faker.random.word(), faker.random.word()],
        fabrics: faker.random.word(),
        picture: {
            url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
            altText: faker.random.word()
        },
        pictures: [{
            url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
            order: faker.random.number(),
            altText: faker.random.word()
        }],
        page: faker.random.word(),
        created: faker.date.past()
    }
};

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Cocokini API Interaction', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedProductsData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('GET Endpoints', function () {

        it('Should GET all Endpoints for Products', function () {

            Products.estimatedDocumentCount().then(count => {
                console.log(count)
            });

            let res;
            return chai.request(app)
                .get('/products')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Products.count();
                })
                .then(function (count) {
                    expect(res.body).to.have.lengthOf(count);
                })
        });

        it('Should GET all Endpoints for Users', function () {

            User.estimatedDocumentCount().then(count => {
                console.log(count)
            });

            let res;
            return chai.request(app)
                .get('/users')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return User.count();
                })
                .then(function (count) {
                    expect(res.body).to.have.lengthOf(count);
                })
        });

        it('Should GET all Endpoints for Events', function () {

            Events.estimatedDocumentCount().then(count => {
                console.log(count)
            });

            let res;
            return chai.request(app)
                .get('/events')
                .then(function (_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    return Events.count();
                })
                .then(function (count) {
                    expect(res.body).to.have.lengthOf(count);
                })
        });
    });

    describe('POST Endpoint', function () {

        it('Should POST an Endpoint for Products', (done) => {
            let product = {

                style: "HOUSE",
                name: "BikiniZone",
                sizes: ["large"],
                fabrics: "Kitty Kat",
                picture: {
                    url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
                    altText: "YO"
                },
                pictures: [{
                    url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
                    order: 1,
                    altText: "Hawaii"
                }],
                page: "2nd Page",
                created: "01/05/1995"
            }

            chai.request(app)
                .post('/products')
                .send(product)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('sizes');
                    done()
                });
        });

        it('Should POST an Endpoint for Users', (done) => {
            let user = {

                email: "laureneware@gmail.com",
                password: "cocototeikini",
                profile: {
                    firstName: "Lauren",
                    lastName: "Ware",
                    location: {
                        address: "211 West Utica St.",
                        city: "Waikiki",
                        state: "Oregon",
                        zipCode: "65478",
                        country: "United States"
                    }
                },
                topSize: "Xtra Large",
                bottomSize: "Large"
            }

            chai.request(app)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    done()
                });
        });

        it('Should POST an Endpoint for Events', (done) => {
            let event = {

                event: "Island Farmers Market - On the Island",
                location: "Padre Island",
                date: "March 23, 2019",
                picture: {
                    url: "https://c1.staticflickr.com/1/961/26918910337_9c2fa22c2e_b.jpg",
                    altText: "Octoberfest"
                }
            }

            chai.request(app)
                .post('/events')
                .send(event)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('location');
                    done()
                });
        });
    });

    describe('PUT Endpoint', function () {

        it('Should PUT down Products', (done) => {
            chai.request(app)
                .put('/products')
                .send({

                    style: "SPHOUSE",
                    name: "BikiniZSSone",
                    sizes: ["large"],
                    fabrics: "KittycKat",
                    picture: {
                        url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
                        altText: "YO"
                    },
                    pictures: [{
                        url: "https://c1.staticflickr.com/1/824/40127048850_995fefa127_b.jpg",
                        order: 1,
                        altText: "Hawaii"
                    }],
                    page: "2nd Page",
                    created: "01/05/1995"
                })

                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);

                    done()
                });
        });

        it('Should PUT down Users', (done) => {
            chai.request(app)
                .put('/users')
                .send({

                    email: "laureneware@gmail.com",
                    password: "cocototeikini",
                    profile: {
                        firstName: "Lauren",
                        lastName: "Ware",
                        location: {
                            address: "211 West Utica St.",
                            city: "Waikiki",
                            state: "Oregon",
                            zipCode: "65478",
                            country: "United States"
                        }
                    },
                    topSize: "Xtra Large",
                    bottomSize: "Large"
                })

                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);

                    done()
                });
        });

        it('Should PUT down Events', (done) => {
            chai.request(app)
                .put('/events')
                .send({

                    event: "Island Farmers Market - On the Island",
                    location: "Padre Island",
                    date: "March 23, 2019",
                    picture: {
                        url: "https://c1.staticflickr.com/1/961/26918910337_9c2fa22c2e_b.jpg",
                        altText: "Octoberfest"
                    }
                })

                .end(function (err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);

                    done()
                });
        });
    });

    describe('DELETE endpoint', function () {

        it('Delete a Product by ID', function () {

            let product1;

            return Products
                .findOne()
                .then(function (_product) {
                    product1 = _product;
                    return chai.request(app).delete(`/products/${product1.id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Products.findById(product1.id);
                })
                .then(function (_product) {
                    expect(_product).to.be.null;
                });
        });

        it('Delete an Event by ID', function () {

            let event1;

            return Events
                .findOne()
                .then(function (_event) {
                    event1 = _event;
                    console.log(arguments);
                    console.log(event1);
                    return chai.request(app).delete(`/events/${event1.id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return Events.findById(event1.id);
                })
                .then(function (_event) {
                    expect(_event).to.be.null;
                });
        });

        it('Delete a User by ID', function () {

            let user2;

            return User
                .findOne()
                .then(function (_user) {
                    user2 = _user;
                    console.log(arguments);
                    console.log(user2);
                    return chai.request(app).delete(`/users/${user2.id}`);
                })
                .then(function (res) {
                    expect(res).to.have.status(204);
                    return User.findById(user2.id);
                })
                .then(function (_user) {
                    expect(_user).to.be.null;
                });
        });


    });

});