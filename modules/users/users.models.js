'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
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
    },
    topSize: {
        type: String
    },
    bottomSize: {
        type: String
    }
});

UserSchema.set('toObject', {
    virtuals: true,
    getters: true
})
UserSchema.set('toJSON', {
    virtuals: true
})

UserSchema.virtual('name').get(function () {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

UserSchema.virtual('locationString').get(function () {
    return `${this.profile.location.address} ${this.profile.location.city} ${this.profile.location.state} ${this.profile.location.zipCode} ${this.profile.location.country}`.trim();
});

UserSchema.methods.serialize = function () {

    return {
        id: this._id,
        email: this.email,
        name: this.name,
        location: this.locationString,
        topSize: this.topSize,
        bottomSize: this.bottomSize
    };
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};