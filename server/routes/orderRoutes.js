const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

//  GET: Fetch orders with optional filtering (status & workstation)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { status, workstation } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (workstation) filter.workstationId = workstation;

    const orders = await Order.find(filter)
      .populate("materialsUsed.materialId", "name")
      .populate("workstationId", "name")
      .populate("createdBy", "username");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST: Create a new production order (Managers only)
router.post("/", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const { productName, quantity, priority, materialsUsed, workstationId } = req.body;

    const newOrder = new Order({
      productName,
      quantity,
      priority,
      materialsUsed,
      workstationId,
      createdBy: req.user.id, // Logged-in Manager's ID
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

//  PUT: Update order status (Operators allowed)
router.put("/:id/status", authenticateUser, authorizeRole("Operator", "Manager"), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Planned", "In Production", "Quality Check", "Completed"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

//  DELETE: Remove an order (Managers only)
router.delete("/:id", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
