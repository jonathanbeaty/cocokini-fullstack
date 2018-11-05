'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
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
        },
    },
    topSize: {
        type: String
    },
    bottomSize: {
        type: String
    }
});

userSchema.virtual('name').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});
userSchema.virtual('location').get(function () {
    return `${this.profile.location.address} ${this.profile.location.city} ${this.profile.location.state} ${this.profile.location.zipCode} ${this.profile.location.country}`.trim();
});

userSchema.methods.serialize = function () {
    return {
        id: this._id,
        email: this.email,
        name: this.name,
        location: this.location,
        topSize: this.topSize,
        bottomSize: this.bottomSize
    };
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}