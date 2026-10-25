

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");

// GET all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a challenge
router.post("/", async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET one challenge by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update a challenge
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({
      message: "Challenge updated successfully",
      challenge,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a challenge
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
