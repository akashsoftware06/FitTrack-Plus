
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const challengeRoutes = require("./routes/challengeRoutes");

app.get("/", (req, res) => {
  res.send("Fitness Challenge Tracker API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working correctly",
  });
});

app.use("/api/challenges", challengeRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
