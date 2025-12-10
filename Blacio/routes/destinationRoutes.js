const express = require("express");
const Destination = require("../models/Destination");
const router = express.Router();

router.get("/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

router.post("/destination", async (req, res) => {
  const { name, country, description, rating } = req.body;

  if (!name || !country) {
    return res.status(400).json({ message: "name and country are required" });
  }

  const destination = new Destination({
    name,
    country,
    description: description || "",
    rating: rating || 0
  });

  try {
    const destinationToSave = await destination.save();
    res.status(201).json(destinationToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
