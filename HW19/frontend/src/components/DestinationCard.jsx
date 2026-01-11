import React from 'react';

const DestinationCard = ({ destination, onEdit, onDelete, onView }) => {
    const imageUrl = destination.img && destination.img.startsWith('http') 
        ? destination.img 
        : `https://via.placeholder.com/400x200/60a5fa/ffffff?text=${encodeURIComponent(destination.name)}`;

    return (
        <div className="card destination-card">
            <img 
                src={imageUrl} 
                alt={destination.name}
                className="destination-card__image"
                onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x200/60a5fa/ffffff?text=${encodeURIComponent(destination.name)}`;
                }}
            />
            
            <div className="destination-card__content">
                <h3 className="destination-card__title">{destination.name}</h3>
                
                <span className="destination-card__country">
                    {destination.country}
                </span>
                
                {destination.description && (
                    <p className="destination-card__description">
                        {destination.description.length > 100 
                            ? `${destination.description.substring(0, 100)}...` 
                            : destination.description}
                    </p>
                )}
                
                {destination.lat && destination.lng && (
                    <p className="destination-card__coords">
                        📍 {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                    </p>
                )}
            </div>
            
            <div className="destination-card__actions">
                <button className="btn btn-secondary" onClick={() => onView(destination)}>
                    👁️ Ver
                </button>
                <button className="btn btn-primary" onClick={() => onEdit(destination)}>
                    ✏️ Editar
                </button>
                <button className="btn btn-danger" onClick={() => onDelete(destination)}>
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    );
};

export default DestinationCard;
