'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: 'We need your email address to create your account'
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        location: {
            address: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            zipCode: {
                type: Number
            },
            country: {
                type: String
            }
        }
    }
});

adminSchema.methods.serialize = function () {
    return {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    };
};

adminSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const admin = mongoose.model('admin', adminSchema);

module.exports = {
    admin
}