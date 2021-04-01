import mongoose from 'mongoose';

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

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;