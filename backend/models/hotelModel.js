import mongoose from 'mongoose';
import geocoder from '../utils/geocoder.js';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true},
    rating: { type: Number, required: true, default: 0},
    comment: { type: String, required: true},
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }, 
  {
    timestamps: true
  }
);

const roomTypeSchema = mongoose.Schema(
  {
    name: {type: String, required: true},
    beds: {type: String, required: true},
    peopleCount: {type: Number, required: true, min: 0},
    availableRooms: {type: Number, required: true, min: 0},
    facilities: [String],
    images: [
        {src: {type: String, required: true}}
    ],
    price: {type: Number, required: true, min: 0}
  }
);

const hotelSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true
    },
    address: {
      type: String, 
      required: true
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
        default: [0, 0]
      },
      formattedAddress: String,
      street: String,
      city: String,
      zipcode: String,
      state: String,
      country: String
    },
    images: [
        {src: {type: String, required: true}}
    ],
    description: {
      type: String, 
      required: true
    },
    amenities: [
        {type: String}
    ],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    roomTypes: [roomTypeSchema]
  },
  {
    timestamps: true
  }
);

// Geocode & creare proprietate locatie
hotelSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    zipcode: loc[0].zipcode,
    state: loc[0].stateCode,
    country: loc[0].countryCode
  }

  // Stergerea adresei din baza de date
  // this.address = undefined;

  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;