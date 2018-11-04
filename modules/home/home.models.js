'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// HOME_PAGE 

//Home page auto changing slideshow images
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

frontPageSliderSchema.methods.serialize = function () {
    return {
        id: this._id,
        img: this.img,
        description: this.description,
        created: this.created
    };
};

const frontPageSlider = mongoose.model('frontPageSlider', frontPageSliderSchema);

//Home page local favorites section images
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

localFavoritesImgSchema.methods.serialize = function () {
    return {
        id: this._id,
        img: this.img,
        bikiniName: this.bikiniName,
        description: this.description,
        created: this.created
    };
};

const localFavoritesImg = mongoose.model('localFavoritesImg', localFavoritesImgSchema);

//Home page upcoming events images and event information
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

upcomingEventsSchema.methods.serialize = function () {
    return {
        id: this._id,
        img: this.img,
        eventName: this.eventName,
        eventDate: this.eventDate,
        eventLocation: this.eventLocation,
        created: this.created
    };
};

const upcomingEvents = mongoose.model('upcomingEvents', upcomingEventsSchema);

module.exports = {
    frontPageSlider,
    localFavoritesImg,
    upcomingEvents
};