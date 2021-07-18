const mongoose = require("mongoose");
const { PAYMENT_COLLECTION } = require("../utils/constants").collections;
const { ObjectId, Number } = mongoose.Schema.Types

const paymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: false,
    },
    orderId: {
      type: String,
      unique: true,
    },
    productIds: {
      type: Array
    },
    amount: {
      type: Number,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(PAYMENT_COLLECTION, paymentSchema);
