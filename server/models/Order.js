const mongoose = require("mongoose");

let orderCounter = 1; // Auto-increment order ID

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Planned", "In Production", "Quality Check", "Completed"],
    default: "Planned",
  },
  materialsUsed: [
    {
      materialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
      },
      quantity: Number,
    },
  ],
  workstationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workstation",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Auto-generate orderId before saving
orderSchema.pre("save", async function (next) {
  this.orderId = `PROD-${orderCounter.toString().padStart(3, "0")}`;
  orderCounter++;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
