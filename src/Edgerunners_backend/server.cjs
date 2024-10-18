const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { exec } = require('child_process'); // Para ejecutar scripts de Python
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log("MongoDB URI:", process.env.MONGO_URI);  // Verifica que no sea undefined

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.log(err));

app.use('/api/incidents', require('./routes/incidents.jsx'));

app.post('/api/predict', (req, res) => {
    const { latitude, longitude } = req.body;

    exec(`python predict.py ${latitude} ${longitude}`, { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el script: ${error}`);
            return res.status(500).send('Error al predecir el riesgo.');
        }
        
        const output = stdout.trim();
        
        const riskLevelMatch = output.match(/Nivel de riesgo predicho: (.+)/);
        const riskLevel = riskLevelMatch ? riskLevelMatch[1] : 'desconocido';

        console.log(`Predicción: ${output}`);
        res.json({ riskLevel });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
