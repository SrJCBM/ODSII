const express = require("express");
const Destination = require("../models/Destination");
const router = express.Router();

// GET all destinations
router.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find({ isShared: true }).sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET destination by ID
router.get("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (destination == null) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new destination
router.post("/destinations", async (req, res) => {
  const { name, country, description, rating, image } = req.body;

  if (!name || !country) {
    return res.status(400).json({ message: "Name and country are required" });
  }

  const destination = new Destination({
    name,
    country,
    description: description || "",
    rating: rating || 0,
    image: image || null,
    isShared: true
  });

  try {
    const destinationToSave = await destination.save();
    res.status(201).json(destinationToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a destination
router.put("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (destination == null) {
      return res.status(404).json({ message: "Destination not found" });
    }

    if (req.body.name) destination.name = req.body.name;
    if (req.body.country) destination.country = req.body.country;
    if (req.body.description) destination.description = req.body.description;
    if (req.body.rating) destination.rating = req.body.rating;
    if (req.body.image) destination.image = req.body.image;

    const updatedDestination = await destination.save();
    res.json(updatedDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a destination
router.delete("/destinations/:id", async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (destination == null) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
