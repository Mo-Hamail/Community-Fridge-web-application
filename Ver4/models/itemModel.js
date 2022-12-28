const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for an Item
let itemSchema = Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 4
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  type: {
    type: String,
    ref: 'Type'
  },
  img: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 256
  }
});

module.exports = mongoose.model("Item", itemSchema);
