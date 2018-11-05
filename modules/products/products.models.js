'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// HOME_PAGE 

//Home page auto changing slideshow images
const frontPageSliderSchema = mongoose.Schema({
    pictures: [{
        url: {
            type: String,
            required: true
        },
        order: {
            type: Number
        },
        altText: {
            type: String
        },
        name: {
            type: String,
            required: 'Must require a name'
        }
    }],
    primaryPicture: {
        type: String,
        required: true
    },
    page: {
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
        page: this.page,
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
    page: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }

});

localFavoritesImgSchema.methods.serialize = function () {
    return {
        id: this._id,
        bikiniName: this.bikiniName,
        page: this.page,
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
    page: {
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
        eventName: this.eventName,
        eventDate: this.eventDate,
        eventLocation: this.eventLocation,
        page: this.page,
        created: this.created
    };
};

const upcomingEvents = mongoose.model('upcomingEvents', upcomingEventsSchema);

//PRODUCTS_OVERVIEW_PAGE

const productsOverviewSchema = mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String,
        required: true
    },
    bikiniName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    page: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

productsOverviewSchema.methods.serialize = function () {
    return {
        id: this._id,
        bikiniName: this.bikiniName,
        price: this.price,
        page: this.page,
        created: this.created
    };
};

const productsOverview = mongoose.model('productsOverview', productsOverviewSchema);

//PRODUCT_PAGE

const productPageSchema = mongoose.Schema({
    bikiniName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sizes: {
        type: String,
        required: true
    },
    sliderImages: {
        data: Buffer,
        contentType: String,
        required: true
    },
    fabricImages: {
        data: Buffer,
        contentType: String,
        required: true
    },
    page: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }

});

const productPage = mongoose.model('productPage', productPageSchema);

module.exports = {
    frontPageSlider,
    localFavoritesImg,
    upcomingEvents,
    productsOverview,
    productPage
};