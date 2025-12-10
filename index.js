const express = require("express");
const mongoose = require("mongoose");
const virtualMachineRoutes = require("./routes/virtualMachineRoutes");

const app = express();
const port = 4005;

app.use(express.json());

app.use("/api", virtualMachineRoutes);

mongoose.connect("mongodb+srv://gabriel:gabriel2004@cluster0.egkcwkm.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });