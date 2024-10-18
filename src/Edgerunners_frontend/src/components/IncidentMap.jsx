import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'; 
import { Card, Container } from 'react-bootstrap';

delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const selectedIncidentIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'), 
  iconSize: [40, 60], 
  iconAnchor: [20, 60], 
  popupAnchor: [0, -60], 
});

const IncidentMap = ({ incidents, selectedIncident }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (selectedIncident && mapRef.current) {
      const lat = selectedIncident.location.coordinates[1];
      const lng = selectedIncident.location.coordinates[0];
      mapRef.current.setView([lat, lng], 13); 
    }
  }, [selectedIncident]);

  const heatmapPoints = incidents.map(incident => [
    incident.location.coordinates[1], 
    incident.location.coordinates[0], 
    incident.severity === 'alta' ? 3 : incident.severity === 'media' ? 2 : 1 
  ]);

  return (
    <Container className="my-4">
      <Card className="bg-dark text-white">
        <Card.Body>
          <Card.Title>Mapa de Incidentes</Card.Title>
          <MapContainer ref={mapRef} center={[21.955176, -102.259197]} zoom={13} style={{ height: '400px', width: '100%' }}>
            {}
            <HeatmapLayer
              fitBoundsOnLoad
              fitBoundsOnUpdate
              points={heatmapPoints} 
              longitudeExtractor={m => m[1]}
              latitudeExtractor={m => m[0]}
              intensityExtractor={m => m[2]}
              max={3} 
              gradient={{
                0.1: 'blue',    
                0.3: 'lime',    
                0.5: 'yellow',  
                0.7: 'orange',  
                1.0: 'red'      
              }}
              radius={30} 
              blur={15}   
            />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {incidents.map((incident) => (
              <Marker key={incident._id} position={[incident.location.coordinates[1], incident.location.coordinates[0]]}>
                <Popup>
                  <strong>{incident.description}</strong><br />
                  Gravedad: {incident.severity}<br />
                  Ubicación: {incident.location.coordinates[0]}, {incident.location.coordinates[1]}
                </Popup>
              </Marker>
            ))}
            {selectedIncident && (
              <Marker
                position={[selectedIncident.location.coordinates[1], selectedIncident.location.coordinates[0]]}
                icon={selectedIncidentIcon} 
              >
                <Popup>
                  <strong>{selectedIncident.description}</strong><br />
                  Gravedad: {selectedIncident.severity}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default IncidentMap;
