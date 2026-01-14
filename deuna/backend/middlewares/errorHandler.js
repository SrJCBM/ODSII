const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Error de validación', 
      detalles: mensajes 
    });
  }

  // Error de duplicado (unique constraint)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      error: `El ${campo} ya está registrado.` 
    });
  }

  // Error de cast (ID inválido de MongoDB)
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'ID inválido.' 
    });
  }

  // Error genérico
  res.status(err.statusCode || 500).json({ 
    error: err.message || 'Error interno del servidor.' 
  });
};

module.exports = errorHandler;
