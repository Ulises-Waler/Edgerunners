import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '300px',
  width: '100%',
};

const center = {
  lat: 21.9417,  
  lng: -102.2465,
};

const IncidentForm = () => {
  const [location, setLocation] = useState({ type: 'Point', coordinates: null });
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [riskLevel, setRiskLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [predictingRisk, setPredictingRisk] = useState(false); 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación', error);
          setError('No se pudo obtener la ubicación. Por favor, habilita los permisos de geolocalización.');
        }
      );
    } else {
      setError('Geolocalización no es soportada por este navegador.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setRiskLevel('');
    setLoading(true);
    setPredictingRisk(false); 

    if (!location.coordinates) {
      setError('Ubicación no disponible. No se puede enviar el incidente sin una ubicación.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/incidents', {
        location,
        description,
        severity,
      });

      console.log('Incidente reportado:', response.data);

      const predictRisk = async () => {
        setPredictingRisk(true); 
        const predictResponse = await axios.post('http://localhost:5000/api/predict', {
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        });

        console.log('Nivel de riesgo:', predictResponse.data.riskLevel);
        setRiskLevel(predictResponse.data.riskLevel);
      };

      predictRisk(); 

      setSuccess(true);
      setDescription('');
      setSeverity('');
      setLocation({ type: 'Point', coordinates: null });
    } catch (error) {
      setError('Error al reportar el incidente o predecir el riesgo. Verifica los datos ingresados.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="text-center my-4">Reportar Incidente</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
        <>
          <Alert variant="success">Incidente reportado con éxito.</Alert>
          {predictingRisk && <Alert variant="info">Prediciendo el nivel de riesgo en la zona...</Alert>}
          {riskLevel && <Alert variant="info">Nivel de riesgo predicho: {riskLevel}</Alert>}
        </>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="formDescription">
          <Form.Label column sm={2}>Descripción:</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formSeverity">
          <Form.Label column sm={2}>Gravedad:</Form.Label>
          <Col sm={10}>
            <Form.Select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              required
            >
              <option value="">Selecciona la gravedad</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <h4 className="mt-4">Ubicación del incidente:</h4>

        <div style={{ backgroundColor: '#343a40', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
          <LoadScript googleMapsApiKey="AIzaSyDkCXkdamNXTN3uZyM_7o7sWobnf-Ml6mA">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location.coordinates ? { lat: location.coordinates[1], lng: location.coordinates[0] } : center}
              zoom={13}
            >
              {location.coordinates && (
                <Marker
                  position={{ lat: location.coordinates[1], lng: location.coordinates[0] }}
                  onClick={() => setShowInfoWindow(true)}
                />
              )}
              {showInfoWindow && (
                <InfoWindow
                  position={{ lat: location.coordinates[1], lng: location.coordinates[0] }}
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <div>
                    <h5>Tu ubicación actual</h5>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <Button variant="primary" type="submit" className="mb-3">
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Enviar Incidente'}
        </Button>
      </Form>
    </Container>
  );
};

export default IncidentForm;
