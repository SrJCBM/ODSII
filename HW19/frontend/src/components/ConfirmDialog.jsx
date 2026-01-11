import React from 'react';

const ConfirmDialog = ({ 
    title = '⚠️ Confirmar acción',
    message = '¿Estás seguro de que deseas realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isLoading = false,
    isDanger = false
}) => {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                
                <div className="modal-body">
                    <p style={{ color: 'var(--color-gray-700)' }}>{message}</p>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳ Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
