# PROMPT PARA CREAR SERVICIOS WEB - DESTINATIONS CRUD

## Instrucciones para el Asistente de IA

Necesito que me ayudes a crear dos servicios web separados que deben estar listos para desplegarse en la nube:

---

## 1. SERVICIO BACKEND (API REST)

Crear una **API REST** usando **Node.js con Express** (o el framework de tu preferencia) que se conecte a MongoDB Atlas y realice las siguientes operaciones sobre la colección `destinations`:

### Conexión a MongoDB:
```
mongodb+srv://SrJCBM:bdd2025@cluster0.tjvfmrk.mongodb.net/travel_brain
```

### Estructura de la colección `destinations`:
```javascript
{
    _id: ObjectId,
    name: String,          // Nombre del destino (ej: "Santa Elena")
    country: String,       // País (ej: "Ecuador")
    description: String,   // Descripción del destino
    lat: Number,           // Latitud (ej: -2.0855611)
    lng: Number,           // Longitud (ej: -81.2642858)
    img: String,           // URL de imagen
    userId: String,        // ID del usuario que creó el destino
    createdAt: Date,       // Fecha de creación
    updatedAt: Date        // Fecha de actualización
}
```

### Operaciones CRUD requeridas:

1. **GET /api/destinations** - Obtener todos los destinos
2. **GET /api/destinations/:id** - Obtener un destino por ID
3. **POST /api/destinations** - Crear un nuevo destino
4. **PUT /api/destinations/:id** - Actualizar un destino existente
5. **DELETE /api/destinations/:id** - Eliminar un destino

### Business Rule (Regla de Negocio):
**Implementar una de las siguientes reglas de negocio:**

- **Opción A - Búsqueda por país:** `GET /api/destinations/country/:country` - Obtener todos los destinos de un país específico
- **Opción B - Destinos cercanos:** `GET /api/destinations/nearby?lat=X&lng=Y&radius=Z` - Obtener destinos dentro de un radio específico (en km) desde unas coordenadas
- **Opción C - Destinos recientes:** `GET /api/destinations/recent/:days` - Obtener destinos creados en los últimos N días
- **Opción D - Estadísticas:** `GET /api/destinations/stats` - Retornar estadísticas (total de destinos, destinos por país, último destino creado)

### Requisitos del Backend:
- Usar variables de entorno para la conexión a MongoDB
- Implementar manejo de errores apropiado
- Configurar CORS para permitir peticiones del frontend
- Incluir archivo `Dockerfile` para despliegue
- Puerto configurable mediante variable de entorno
- Respuestas en formato JSON

---

## 2. SERVICIO FRONTEND (Interfaz Web)

Crear una **aplicación web frontend** usando **React, Vue, Angular, o HTML/CSS/JS vanilla** que consuma la API del backend.

### Funcionalidades requeridas:

1. **Listar destinos** - Mostrar todos los destinos en tarjetas o tabla
2. **Ver detalle** - Ver información completa de un destino
3. **Crear destino** - Formulario para agregar nuevo destino
4. **Editar destino** - Formulario para modificar destino existente
5. **Eliminar destino** - Botón para eliminar con confirmación
6. **Business Rule UI** - Interfaz para la regla de negocio implementada (ej: filtro por país, búsqueda por ubicación, etc.)

### Requisitos del Frontend:
- Diseño responsivo (funcione en móvil y escritorio)
- Mensajes de éxito/error al usuario
- Validación de formularios
- Incluir archivo `Dockerfile` para despliegue
- La URL del backend debe ser configurable (variable de entorno)

---

## 3. ESTRUCTURA DE CARPETAS SUGERIDA

```
proyecto/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Destination.js
│   │   ├── routes/
│   │   │   └── destinationRoutes.js
│   │   ├── controllers/
│   │   │   └── destinationController.js
│   │   └── config/
│   │       └── database.js
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
└── README.md
```

---

## 4. DATOS DE EJEMPLO EN LA COLECCIÓN

La colección `destinations` ya contiene datos como:

```json
{
    "_id": "6906e8201ca71fe12c0fad82",
    "name": "Santa Elena",
    "country": "Ecuador",
    "description": "",
    "lat": -2.0855611,
    "lng": -81.2642858,
    "img": "https://www.google.com/maps/place/Santa+Elena/@-2.0855611,-81.2642858,...",
    "userId": "6906e1044a4e68f6420e4922",
    "createdAt": "2025-11-02T05:11:59.919+00:00",
    "updatedAt": "2025-11-02T05:11:59.919+00:00"
}
```

```json
{
    "_id": "6906e8571ca71fe12c0fad83",
    "name": "Casa",
    "country": "Ecuador",
    "description": "",
    "lat": -0.2295316,
    "lng": -78.485033617,
    "img": "https://www.google.com/maps/place/Quero+362,+Quito+170145/@-0.2295316,...",
    "userId": "6906e1044a4e68f6420e4922",
    "createdAt": "2025-11-02T05:12:55.280+00:00",
    "updatedAt": "2025-11-02T05:12:55.280+00:00"
}
```

```json
{
    "_id": "690adcf3361820f03109e642",
    "name": "Colombia, Huila, Colombia",
    "country": "Colombia",
    "description": "",
    "lat": null,
    "lng": null,
    "img": null,
    "userId": null,
    "createdAt": null,
    "updatedAt": null
}
```

---

## 5. OPCIONES DE DESPLIEGUE EN LA NUBE (Gratuitas)

### Backend:
- **Render.com** (recomendado, gratuito)
- **Railway.app**
- **Vercel** (para serverless)
- **Fly.io**

### Frontend:
- **Vercel** (recomendado para React/Vue/Next)
- **Netlify**
- **Render.com**
- **GitHub Pages** (solo estáticos)

---

## 6. ENTREGABLES ESPERADOS

1. ✅ Código fuente del **Backend** con API REST funcional
2. ✅ Código fuente del **Frontend** con interfaz de usuario
3. ✅ **Dockerfiles** para ambos servicios
4. ✅ Archivo **README.md** con instrucciones de instalación y uso
5. ✅ Variables de entorno documentadas (**.env.example**)
6. ✅ Al menos **UNA regla de negocio** implementada

---

## NOTAS ADICIONALES

- La base de datos MongoDB ya está en la nube (MongoDB Atlas)
- La colección `destinations` ya tiene 11 documentos
- El usuario puede elegir cualquier lenguaje/framework
- Los servicios deben poder desplegarse de forma independiente

---

**¡Comienza creando primero el backend y luego el frontend!**
