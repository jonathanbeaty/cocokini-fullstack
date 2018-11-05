'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const productsSchema = mongoose.Schema({
    style: {
        type: String,
        required: 'Must declare Top, Bottoms, or Fullsuit style. Thank you, have good day.'
    },
    bikiniName: {
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
    bikiniPicture: [{
        url: {
            type: String,
            required: true
        },
        order: {
            type: Number
        },
        altText: {
            type: String,
            required: 'What encapsulates this bikini image in words?'
        },
    }],
    primaryPicture: {
        type: String,
        required: 'Must declare if this image will headline a section YES or NO'
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
        bikiniName: this.bikiniName,
        sizes: this.sizes,
        fabrics: this.fabrics,
        bikiniPicture: this.bikiniPicture,
        primaryPicture: this.primaryPicture,
        page: this.page,
        created: this.created
    };
};

const Products = mongoose.model('Products', productsSchema);

module.exports = {
    Products
};