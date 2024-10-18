// src/components/IncidentList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form, Button } from 'react-bootstrap';
import IncidentMap from './IncidentMap'; 
import IncidentHeatmap from './IncidentHeatmap'; 
import MapComponent from './MapComponent'; 

const IncidentList = () => {
    const [incidents, setIncidents] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedIncident, setSelectedIncident] = useState(null);

    const fetchIncidents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/incidents');
            setIncidents(response.data);
        } catch (error) {
            console.error('Error al obtener incidentes:', error);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const filteredIncidents = incidents.filter(incident =>
        incident.severity.toLowerCase().includes(filter.toLowerCase())
    );

    const clearFilter = () => {
        setFilter('');
    };

    const handleRowClick = (incident) => {
        setSelectedIncident(incident);
    };

    const realIncidents = filteredIncidents.filter(incident => !incident.isFalseReport);
    const falseIncidents = filteredIncidents.filter(incident => incident.isFalseReport);

    const patrolRoutes = [
        { lat: 21.8843, lng: -102.2910 },
        { lat: 21.8850, lng: -102.2925 },
        { lat: 21.8860, lng: -102.2930 },
        { lat: 21.8870, lng: -102.2940 },
    ];

    return (
        <Container>
            <h2 className="my-4">Lista de Incidentes</h2>
            <Form.Group controlId="filter" className="mb-3">
                <div className="d-flex">
                    <Form.Select
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)} 
                        className="me-2"
                    >
                        <option value="">Filtrar por gravedad</option>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </Form.Select>
                    <Button variant="outline-secondary" onClick={clearFilter}>
                        Limpiar
                    </Button>
                </div>
            </Form.Group>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Gravedad</th>
                        <th>Ubicación</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIncidents.length > 0 ? (
                        filteredIncidents.map((incident) => (
                            <tr key={incident._id} onClick={() => handleRowClick(incident)} style={{ cursor: 'pointer' }}>
                                <td>{incident._id}</td>
                                <td>{incident.description}</td>
                                <td>{incident.severity}</td>
                                <td>{`Lat: ${incident.location.coordinates[1]}, Lng: ${incident.location.coordinates[0]}`}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No se encontraron incidentes.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {}
            <h4>Mapa de Reportes Reales</h4>
            <IncidentMap incidents={realIncidents} selectedIncident={selectedIncident} />
            {}
            <h4>Mapa de Reportes Falsos</h4>
            <IncidentMap incidents={falseIncidents} selectedIncident={selectedIncident} />
            <div className='mb-3'>
                {}
                <h4>Mapa En Tiempo Real</h4>
                {}
                <MapComponent incidents={filteredIncidents} patrolRoutes={patrolRoutes} />
            </div>
        </Container>
    );
};

export default IncidentList;
