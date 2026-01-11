import React, { useState, useEffect } from 'react';

const DestinationForm = ({ destination, onSave, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        description: '',
        lat: '',
        lng: '',
        img: '',
        userId: ''
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (destination) {
            setFormData({
                name: destination.name || '',
                country: destination.country || '',
                description: destination.description || '',
                lat: destination.lat !== null ? destination.lat : '',
                lng: destination.lng !== null ? destination.lng : '',
                img: destination.img || '',
                userId: destination.userId || ''
            });
        }
    }, [destination]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }
        
        if (!formData.country.trim()) {
            newErrors.country = 'El país es obligatorio';
        }
        
        if (formData.lat && (isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90)) {
            newErrors.lat = 'Latitud inválida (-90 a 90)';
        }
        
        if (formData.lng && (isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180)) {
            newErrors.lng = 'Longitud inválida (-180 a 180)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const dataToSend = {
            ...formData,
            lat: formData.lat !== '' ? parseFloat(formData.lat) : null,
            lng: formData.lng !== '' ? parseFloat(formData.lng) : null,
            img: formData.img || null,
            userId: formData.userId || null
        };
        
        onSave(dataToSend);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{destination ? '✏️ Editar Destino' : '➕ Nuevo Destino'}</h2>
                    <button 
                        className="btn btn-secondary" 
                        onClick={onCancel}
                        style={{ padding: '0.25rem 0.5rem' }}
                    >
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Nombre del destino *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej: Santa Elena, Machu Picchu..."
                                style={errors.name ? { borderColor: 'var(--color-danger)' } : {}}
                            />
                            {errors.name && (
                                <small style={{ color: 'var(--color-danger)' }}>{errors.name}</small>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="country">País *</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Ej: Ecuador, Perú, Colombia..."
                                style={errors.country ? { borderColor: 'var(--color-danger)' } : {}}
                            />
                            {errors.country && (
                                <small style={{ color: 'var(--color-danger)' }}>{errors.country}</small>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe este destino turístico..."
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lat">Latitud</label>
                                <input
                                    type="number"
                                    id="lat"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    placeholder="-2.0855611"
                                    step="any"
                                    style={errors.lat ? { borderColor: 'var(--color-danger)' } : {}}
                                />
                                {errors.lat && (
                                    <small style={{ color: 'var(--color-danger)' }}>{errors.lat}</small>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lng">Longitud</label>
                                <input
                                    type="number"
                                    id="lng"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    placeholder="-81.2642858"
                                    step="any"
                                    style={errors.lng ? { borderColor: 'var(--color-danger)' } : {}}
                                />
                                {errors.lng && (
                                    <small style={{ color: 'var(--color-danger)' }}>{errors.lng}</small>
                                )}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="img">URL de imagen</label>
                            <input
                                type="url"
                                id="img"
                                name="img"
                                value={formData.img}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                    </div>
                    
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-success"
                            disabled={isLoading}
                        >
                            {isLoading ? '⏳ Guardando...' : '💾 Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DestinationForm;
