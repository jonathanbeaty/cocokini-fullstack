'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const productsSchema = mongoose.Schema({
    style: {
        type: String,
        required: 'Must declare Top, Bottoms, or Fullsuit style. Thank you, have good day.'
    },
    name: {
        type: String,
        required: 'Must declare the name of the Bikini. Thank you, have good day.'
    },
    sizes: [{
        type: String,
        required: 'Must declare all sizes offered for this Bikini. Thank you, have good day.'
    }],
    fabrics: [{
        type: String,
        required: 'Must declare fabric offered '
    }],
    pictures: [{
        url: {
            type: String,
        },
        order: {
            type: Number
        },
        altText: {
            type: String,
        },
    }],
    picture: {
        url: {
            type: String,
        },
        altText: {
            type: String,
        }
    },
    page: {
        type: String,
        required: 'What page should this bikini have access to? Home, Products, Product'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

productsSchema.methods.serialize = function () {
    return {
        id: this._id,
        style: this.style,
        name: this.name,
        sizes: this.sizes,
        fabrics: this.fabrics,
        picture: this.picture,
        pictures: this.pictures,
        page: this.page,
        created: this.created
    };
};

const Products = mongoose.model('Products', productsSchema);

module.exports = {
    Products
};