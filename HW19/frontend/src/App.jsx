import React, { useState, useEffect, useCallback } from 'react';
import * as api from './services/api';
import DestinationCard from './components/DestinationCard';
import DestinationForm from './components/DestinationForm';
import DestinationDetail from './components/DestinationDetail';
import ConfirmDialog from './components/ConfirmDialog';
import Alert from './components/Alert';

function App() {
    const [destinations, setDestinations] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [alert, setAlert] = useState(null);

    const loadDestinations = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = selectedCountry 
                ? await api.getDestinationsByCountry(selectedCountry)
                : await api.getAllDestinations();
            setDestinations(response.data);
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsLoading(false);
        }
    }, [selectedCountry]);

    const loadCountries = async () => {
        try {
            const response = await api.getCountries();
            setCountries(response.data);
        } catch (error) {
            console.error('Error cargando países:', error);
        }
    };

    useEffect(() => {
        loadDestinations();
    }, [loadDestinations]);

    useEffect(() => {
        loadCountries();
    }, []);

    const handleOpenForm = (destination = null) => {
        setSelectedDestination(destination);
        setShowForm(true);
    };

    const handleViewDetail = (destination) => {
        setSelectedDestination(destination);
        setShowDetail(true);
    };

    const handleConfirmDelete = (destination) => {
        setSelectedDestination(destination);
        setShowConfirm(true);
    };

    const handleSave = async (data) => {
        try {
            setIsSaving(true);
            
            if (selectedDestination?._id) {
                await api.updateDestination(selectedDestination._id, data);
                setAlert({ type: 'success', message: 'Destino actualizado correctamente' });
            } else {
                await api.createDestination(data);
                setAlert({ type: 'success', message: 'Destino creado correctamente' });
            }
            
            setShowForm(false);
            setSelectedDestination(null);
            loadDestinations();
            loadCountries();
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedDestination) return;
        
        try {
            setIsSaving(true);
            await api.deleteDestination(selectedDestination._id);
            
            setAlert({ type: 'success', message: 'Destino eliminado correctamente' });
            setShowConfirm(false);
            setSelectedDestination(null);
            loadDestinations();
            loadCountries();
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCountryFilter = (e) => {
        setSelectedCountry(e.target.value);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>🌍 Destinations</h1>
                <p>Gestión de destinos turísticos</p>
            </header>
            
            <main className="container">
                {alert && (
                    <Alert 
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
                
                <div className="filter-bar">
                    <div style={{ flex: 1 }}>
                        <label htmlFor="countryFilter" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
                            🌍 Filtrar por país:
                        </label>
                        <select 
                            id="countryFilter"
                            value={selectedCountry}
                            onChange={handleCountryFilter}
                        >
                            <option value="">Todos los países</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button className="btn btn-success" onClick={() => handleOpenForm(null)}>
                        ➕ Nuevo Destino
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : destinations.length === 0 ? (
                    <div className="empty-state card">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                        <h3>No hay destinos {selectedCountry ? `en ${selectedCountry}` : ''}</h3>
                        <p style={{ marginBottom: '1rem' }}>
                            {selectedCountry 
                                ? 'Intenta seleccionar otro país o quita el filtro'
                                : 'Comienza agregando tu primer destino turístico'}
                        </p>
                        {!selectedCountry && (
                            <button className="btn btn-primary" onClick={() => handleOpenForm(null)}>
                                ➕ Agregar destino
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <p style={{ 
                            marginBottom: 'var(--spacing-md)', 
                            color: 'var(--color-gray-500)',
                            fontSize: '0.875rem'
                        }}>
                            Mostrando {destinations.length} destino{destinations.length !== 1 ? 's' : ''}
                            {selectedCountry && ` en ${selectedCountry}`}
                        </p>
                        
                        <div className="destinations-grid">
                            {destinations.map(destination => (
                                <DestinationCard
                                    key={destination._id}
                                    destination={destination}
                                    onView={handleViewDetail}
                                    onEdit={handleOpenForm}
                                    onDelete={handleConfirmDelete}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>
            
            {showForm && (
                <DestinationForm
                    destination={selectedDestination}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedDestination(null);
                    }}
                    isLoading={isSaving}
                />
            )}
            
            {showDetail && (
                <DestinationDetail
                    destination={selectedDestination}
                    onClose={() => {
                        setShowDetail(false);
                        setSelectedDestination(null);
                    }}
                />
            )}
            
            {showConfirm && (
                <ConfirmDialog
                    title="🗑️ Eliminar destino"
                    message={`¿Estás seguro de que deseas eliminar "${selectedDestination?.name}"? Esta acción no se puede deshacer.`}
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    isDanger={true}
                    isLoading={isSaving}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setShowConfirm(false);
                        setSelectedDestination(null);
                    }}
                />
            )}
        </div>
    );
}

export default App;
