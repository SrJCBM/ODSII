import React, { useEffect } from 'react';

const Alert = ({ type = 'info', message, onClose, autoClose = true, duration = 4000 }) => {
    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    return (
        <div className={`alert alert-${type}`} role="alert">
            <span>{icons[type] || icons.info}</span>
            <span style={{ flex: 1 }}>{message}</span>
            {onClose && (
                <button 
                    onClick={onClose}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        opacity: 0.7
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;
