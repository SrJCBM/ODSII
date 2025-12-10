const express = require("express");
const mongoose = require("mongoose");
const virtualMachineRoutes = require("./routes/virtualMachineRoutes");

const app = express();
app.use(express.json());
app.use(virtualMachineRoutes);
