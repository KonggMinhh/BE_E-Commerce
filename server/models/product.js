const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        text: true,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Categories",
        // required: true,
    },
    // Duong dan vd dong-ho
    slug: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: [],
        required: true,
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
            comment: { type: String },
        },
    ],
    totalRatings: {
        type: Number,
        default: 0,
    },
    promotion: {
        type: String,
        default: "",
    },
    storage: {
        type: String,
        enum: ["64GB", "128GB", "256GB", "512GB", "1TB"],
        required: true,
    },
});

//Export the model
module.exports = mongoose.model("Product", productSchema);
