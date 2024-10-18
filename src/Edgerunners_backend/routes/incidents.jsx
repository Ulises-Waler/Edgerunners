const express = require('express');
const Incident = require('../models/incident');
const router = express.Router();

// Crear un nuevo incidente
router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todos los incidentes
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
