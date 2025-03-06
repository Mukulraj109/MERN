const express = require("express");
const Workstation = require("../models/Workstation");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/workstations
 * @desc    Get all workstations
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const workstations = await Workstation.find();
    res.json(workstations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workstations" });
  }
});

/**
 * @route   POST /api/workstations
 * @desc    Create a new workstation
 * @access  Private (Managers only)
 */
router.post("/", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const newWorkstation = new Workstation(req.body);
    await newWorkstation.save();
    res.status(201).json(newWorkstation);
  } catch (error) {
    res.status(500).json({ message: "Error creating workstation" });
  }
});

/**
 * @route   PUT /api/workstations/:id
 * @desc    Update workstation status
 * @access  Private (Managers only)
 */
router.put("/:id", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const workstation = await Workstation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workstation) return res.status(404).json({ message: "Workstation not found" });

    res.json(workstation);
  } catch (error) {
    res.status(500).json({ message: "Error updating workstation" });
  }
});

/**
 * @route   DELETE /api/workstations/:id
 * @desc    Delete a workstation
 * @access  Private (Managers only)
 */
router.delete("/:id", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const workstation = await Workstation.findByIdAndDelete(req.params.id);
    if (!workstation) return res.status(404).json({ message: "Workstation not found" });

    res.json({ message: "Workstation deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting workstation" });
  }
});

module.exports = router;
