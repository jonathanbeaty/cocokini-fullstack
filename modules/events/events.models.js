'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EventsSchema = mongoose.Schema({
    event: {
        type: String,
        required: 'We need your email address to create your account'
    },
    location: {
        type: String,
        required: 'We need the location please'
    },
    date: {
        type: Date
    },
    picture: {
        url: {
            type: String,
            required: true
        },
        altText: {
            type: String
        }
    }
});

EventsSchema.set('toObject', {
    virtuals: true,
    getters: true
})

EventsSchema.set('toJSON', {
    virtuals: true
})

EventsSchema.methods.serialize = function () {

    return {
        id: this._id,
        event: this.event,
        location: this.location,
        date: this.date,
        picture: this.picture
    };
};

const Events = mongoose.model('Events', EventsSchema);

module.exports = {
    Events
};