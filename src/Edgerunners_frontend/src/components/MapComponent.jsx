
import React from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 21.8781, 
  lng: -102.2915 
};

const MapComponent = ({ incidents, patrolRoutes }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDkCXkdamNXTN3uZyM_7o7sWobnf-Ml6mA">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {}
        {incidents.map((incident) => (
          <Marker 
            key={incident._id} 
            position={{ lat: incident.location.coordinates[1], lng: incident.location.coordinates[0] }} 
          />
        ))}

        {}
        <Polyline
          path={patrolRoutes}
          options={{
            strokeColor: '#0000FF',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
