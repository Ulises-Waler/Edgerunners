const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  description: { type: String, required: true },
  severity: { 
    type: String, 
    required: true, 
    enum: ['baja', 'media', 'alta', 'Baja', 'Media', 'Alta'] 
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  }
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
