import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
  {
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, required: true, min: 0 },
    hotel: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
      },
      name: { type: String, required: true }
    },
    room: {
      _id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel.roomTypes',
        required: true 
      },
      name: { type: String, required: true }
    },
    price: { type: Number, required: true, default: 0.0 },
  }
)

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    booking: bookingSchema,
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false
    },
    paidAt: {
      type: Date
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveredAt: {
      type: Date
    }
  }, 
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;