const mongoose = require("mongoose");

const virtualMachineSchema = new mongoose.Schema({
  ram: {type: Number,required: true},
  cpu: {type: Number,required: true},
  storage: {type: Number,required: true},
  totalPrice: {type: Number,required: true}
});

module.exports = mongoose.model("virtualMachine", virtualMachineSchema);
