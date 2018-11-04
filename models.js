'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// HOME_PAGE 

const frontPageSliderSchema = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const localFavoritesImgSchema = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String,
        required: true
    },
    bikiniName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }

});

const upcomingEventsSchema = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }

});



frontPageSliderSchema.methods.serialize = function () {
    return {
        id: this._id,
        img: this.img,
        description: this.description,
        created: this.created
    };
};