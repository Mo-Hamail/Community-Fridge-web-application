const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Fridge
let fridgeSchema = Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 6
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  numItemsAccepted: {
    type: Number,
    default: 0
  },
  canAcceptItems: {
    type: Number,
    required: true,
    min: 0, //contradicts with new fridge added
    max: 100
  },
  contactInfo: {
    contactPerson: {type: String, required: true, minlength: 4, maxlength: 30},
    contactPhone: {type: String, required: true, minlength: 10, maxlength: 14}
  },
  address: {
    street: {type: String, required: true, minlength: 4, maxlength: 40},
    postalCode: {type: String, required: true, minlength: 6, maxlength: 7},
    city: {type: String, required: true, minlength: 3, maxlength: 20},
    province: {type: String, required: true, minlength: 3, maxlength: 20},
    country: {type: String, required: true, minlength: 3, maxlength: 20}
  },
  acceptedTypes: [{
    type: String,
    ref: 'Type',
    required: true
  }],
  items: [{
    id: {
          type: String,
          ref: 'Item'
        },
    quantity: Number
  }]
});

module.exports = mongoose.model("Fridge", fridgeSchema);
