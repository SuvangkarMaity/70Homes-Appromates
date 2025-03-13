import mongoose from 'mongoose';

// create listing schema
const listingSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        regularPrice:{
            type: Number,
            required: true,
        },
        discountPrice:{
            type: Number,
            required: true,
        },
        bathrooms:{
            type: Number,
            required: true,
        },
        bedrooms:{
            type: Number,
            required: true,
        },
        furnished:{
            type: Boolean,
            required: true,
        },
        parking:{
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        offer:{
            type: Boolean,
            required: true,
        },
        imageUrls:{
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },
        user_type: {
            type: String,
            required: true,
        },

        // Additional Features
        seaView: {
            type: Boolean,
            default: false,
        },
        cityView: {
            type: Boolean,
            default: false,
        },
        wheelchairAccessible: {
            type: Boolean,
            default: false,
        },
        elevator: {
            type: Boolean,
            default: false,
        },

        // Amenities
        balcony: {
            type: Boolean,
            default: false,
        },
        garden: {
            type: Boolean,
            default: false,
        },
        terrace: {
            type: Boolean,
            default: false,
        },
        petFriendly: {
            type: Boolean,
            default: false,
        },

        // Security Features
        cctv: {
            type: Boolean,
            default: false,
        },
        securityGuard: {
            type: Boolean,
            default: false,
        },
        gatedCommunity: {
            type: Boolean,
            default: false,
        },

        // Energy Efficiency & Availability
        solarPanels: {
            type: Boolean,
            default: false,
        },
        energyEfficient: {
            type: Boolean,
            default: false,
        },
        immediateAvailability: {
            type: Boolean,
            default: false,
        },
    }, {timestamps: true} // save time of creation & updation
)

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
