const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumStockLevel: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model("Material", materialSchema);
