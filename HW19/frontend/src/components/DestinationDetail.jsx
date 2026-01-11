import React from 'react';

const DestinationDetail = ({ destination, onClose }) => {
    if (!destination) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const imageUrl = destination.img && destination.img.startsWith('http')
        ? destination.img
        : `https://via.placeholder.com/600x300/60a5fa/ffffff?text=${encodeURIComponent(destination.name)}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>📍 Detalles del Destino</h2>
                    <button 
                        className="btn btn-secondary" 
                        onClick={onClose}
                        style={{ padding: '0.25rem 0.5rem' }}
                    >
                        ✕
                    </button>
                </div>
                
                <div className="modal-body" style={{ padding: 0 }}>
                    <img 
                        src={imageUrl}
                        alt={destination.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/600x300/60a5fa/ffffff?text=${encodeURIComponent(destination.name)}`;
                        }}
                    />
                    
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                            {destination.name}
                        </h3>
                        
                        <span className="destination-card__country" style={{ marginBottom: 'var(--spacing-md)', display: 'inline-block' }}>
                            🌍 {destination.country}
                        </span>
                        
                        {destination.description && (
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <strong style={{ color: 'var(--color-gray-700)' }}>Descripción:</strong>
                                <p style={{ color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)' }}>
                                    {destination.description}
                                </p>
                            </div>
                        )}
                        
                        <div style={{ 
                            background: 'var(--color-gray-50)', 
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--border-radius)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <table style={{ width: '100%', fontSize: '0.875rem' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: 'var(--spacing-xs) 0', color: 'var(--color-gray-500)' }}>
                                            📍 Latitud:
                                        </td>
                                        <td style={{ padding: 'var(--spacing-xs) 0', textAlign: 'right' }}>
                                            {destination.lat !== null ? destination.lat : 'No especificada'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: 'var(--spacing-xs) 0', color: 'var(--color-gray-500)' }}>
                                            📍 Longitud:
                                        </td>
                                        <td style={{ padding: 'var(--spacing-xs) 0', textAlign: 'right' }}>
                                            {destination.lng !== null ? destination.lng : 'No especificada'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: 'var(--spacing-xs) 0', color: 'var(--color-gray-500)' }}>
                                            📅 Creado:
                                        </td>
                                        <td style={{ padding: 'var(--spacing-xs) 0', textAlign: 'right' }}>
                                            {formatDate(destination.createdAt)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: 'var(--spacing-xs) 0', color: 'var(--color-gray-500)' }}>
                                            🔄 Actualizado:
                                        </td>
                                        <td style={{ padding: 'var(--spacing-xs) 0', textAlign: 'right' }}>
                                            {formatDate(destination.updatedAt)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: 'var(--spacing-xs) 0', color: 'var(--color-gray-500)' }}>
                                            🔑 ID:
                                        </td>
                                        <td style={{ 
                                            padding: 'var(--spacing-xs) 0', 
                                            textAlign: 'right',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem'
                                        }}>
                                            {destination._id}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {destination.lat && destination.lng && (
                            <a 
                                href={`https://www.google.com/maps?q=${destination.lat},${destination.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
                            >
                                🗺️ Ver en Google Maps
                            </a>
                        )}
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DestinationDetail;
