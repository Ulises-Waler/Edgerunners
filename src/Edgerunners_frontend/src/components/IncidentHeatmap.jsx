import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const IncidentHeatmap = ({ incidents }) => {
  const mapRef = useRef();

  useEffect(() => {
    const map = mapRef.current;

    if (map) {
      const heatLayer = L.heatLayer([], {
        radius: 25,     
        blur: 15,       
        gradient: {     
          0.1: 'blue',    
          0.3: 'lime',    
          0.5: 'yellow',  
          0.7: 'orange',  
          1.0: 'red'      
        }
      }).addTo(map);

      const heatmapData = incidents.map(incident => {
        const intensity = incident.severity === 'alta' ? 1 : incident.severity === 'media' ? 0.7 : 0.3;
        return [incident.location.coordinates[1], incident.location.coordinates[0], intensity];
      });

      heatLayer.setLatLngs(heatmapData);
    }
  }, [incidents]);

  return (
    <></>
  );
};

export default IncidentHeatmap;
