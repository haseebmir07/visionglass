import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    userId: {
        type: String,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        default: 0
    },

    offerPrice: {
        type: Number,
        default: 0
    },

    pricingType: {
        type: String,
        enum: ['fixed', 'sqft'],
        default: 'fixed'
    },

    pricePerSqFt: {
        type: Number,
        default: 0
    },

    image: {
        type: Array,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    // ✅ NEW FIELD (Dynamic Dimensions)
    sizes: {
        type: [String],
        default: []
    },

    date: {
        type: Number,
        required: true
    }

});

const Product =
    mongoose.models.product ||
    mongoose.model("product", productSchema);

export default Product;