const express = require("express");
const VirtualMachine = require("../models/virtualMachine");
const router = express.Router();

const PRICE_RAM = 0.10;    
const PRICE_CPU = 0.25;     
const PRICE_STORAGE = 0.20; 

router.get("/virtualMachines", async (req, res) => {
  try {
    const vms = await VirtualMachine.find();
    res.json(vms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/virtualMachines/:id", async (req, res) => {
  try {
    const vm = await VirtualMachine.findById(req.params.id);
    if (vm == null) {
      return res.status(404).json(404);
    } else {
      res.json(vm);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/virtualMachine", async (req, res) => {
  const ram = Number(req.body.ram);
  const cpu = Number(req.body.cpu);
  const storage = Number(req.body.storage);

  if (isNaN(ram) || isNaN(cpu) || isNaN(storage)) {
    return res.status(400).json({ message: "ram, cpu y storage deben ser numéricos" });
  }

  const totalPrice =
    ram * PRICE_RAM +
    cpu * PRICE_CPU +
    storage * PRICE_STORAGE;

  const vmObject = new VirtualMachine({
    ram,
    cpu,
    storage,
    totalPrice
  });

  try {
    const vmToSave = await vmObject.save();
    res.status(200).json(vmToSave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
