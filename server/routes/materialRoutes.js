const express = require("express");
const Material = require("../models/Material");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching materials" });
  }
});

router.post(
  "/",
  authenticateUser,
  authorizeRole("Manager"),
  [
    check("name", "Material name is required").not().isEmpty(),
    check("currentStock", "Stock must be a number").isNumeric(),
    check("minimumStockLevel", "Minimum stock level must be a number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, currentStock, minimumStockLevel } = req.body;
      const newMaterial = new Material({ name, currentStock, minimumStockLevel });

      await newMaterial.save();
      res.status(201).json(newMaterial);
    } catch (error) {
      res.status(500).json({ message: "Error adding material" });
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: "Error fetching material" });
  }
});

router.put(
  "/:id",
  authenticateUser,
  authorizeRole("Manager"),
  [
    check("currentStock", "Stock must be a number").optional().isNumeric(),
    check("minimumStockLevel", "Minimum stock level must be a number").optional().isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const material = await Material.findById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: "Material not found" });
      }

      Object.assign(material, req.body);
      await material.save();

      res.json(material);
    } catch (error) {
      res.status(500).json({ message: "Error updating material" });
    }
  }
);


router.delete("/:id", authenticateUser, authorizeRole("Manager"), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    await material.deleteOne();
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting material" });
  }
});

module.exports = router;
