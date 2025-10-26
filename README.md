# Ventana de Johari - Ejercicio de Equipo

Aplicación web minimalista para realizar el ejercicio de la Ventana de Johari con equipos distribuidos.

## 🎯 Características

- **HTML5 + CSS3 + JavaScript Vanilla** (sin dependencias)
- **Multi-idioma** con hot-reload (Español, Francés, Inglés)
- **Persistencia local** con LocalStorage
- **Visualización dual**: clásica (4 cuadrantes iguales) y proporcional
- **56 adjetivos** de la Ventana de Johari original
- **Códigos únicos** de acceso para 9 participantes
- **Panel de administrador** con vista de todas las ventanas
- **Exportación** de datos y descarga de imágenes

## 📋 Flujo de uso

### 1. Configuración inicial (Admin)
- Accede a `index.html`
- Ingresa los 9 nombres de participantes
- Genera códigos de acceso únicos
- Comparte códigos con el equipo

### 2. Participantes
- Accede a `participante.html` con su código
- Completa autoevaluación (5-6 adjetivos)
- Evalúa a los 8 compañeros (5-6 adjetivos cada uno)
- Visualiza su ventana al finalizar

### 3. Análisis (Admin)
- Accede a `admin.html` con código de administrador
- Ve el progreso de todos
- Visualiza todas las ventanas generadas
- Descarga imágenes individuales o todas
- Exporta datos a JSON

## 🚀 Despliegue

### Opción 1: Local
```bash
# Servidor Python simple
python3 -m http.server 8000

# O con Node.js
npx http-server -p 8000
```

Accede a `http://localhost:8000`

### Opción 2: Cloud Run (Google Cloud)
```bash
# 1. Crea un Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# 2. Construye y despliega
gcloud builds submit --tag gcr.io/[PROJECT-ID]/johari-window
gcloud run deploy johari-window \
  --image gcr.io/[PROJECT-ID]/johari-window \
  --platform managed \
  --allow-unauthenticated
```

### Opción 3: Netlify/Vercel
- Sube la carpeta completa
- Deploy automático
- ¡Listo! 🎉

## 📁 Estructura del proyecto

```
johari-window/
├── index.html              # Setup inicial
├── participante.html       # Interfaz participantes
├── admin.html             # Panel administrador
├── css/
│   └── styles.css         # Estilos minimalistas
└── js/
    ├── i18n.js           # Sistema de traducciones
    ├── data.js           # Adjetivos + almacenamiento
    ├── johari.js         # Algoritmo de cálculo
    ├── canvas.js         # Visualización
    ├── setup.js          # Lógica de setup
    ├── participante.js   # Lógica participante
    └── admin.js          # Lógica admin
```

## 🎨 Personalización

### Cambiar colores de áreas
Edita en `js/canvas.js`:
```javascript
const colors = {
    open: '#10b981',    // Verde
    blind: '#f59e0b',   // Naranja
    hidden: '#3b82f6',  // Azul
    unknown: '#94a3b8'  // Gris
};
```

### Añadir nuevo idioma
Edita en `js/i18n.js`:
```javascript
translations: {
    es: { ... },
    fr: { ... },
    en: { ... },
    de: { ... }  // Nuevo idioma
}
```

### Modificar adjetivos
Edita en `js/data.js`:
```javascript
adjectives: {
    es: [ ... ],
    fr: [ ... ],
    en: [ ... ]
}
```

## 🔒 Privacidad

- Todos los datos se almacenan en **LocalStorage del navegador**
- No hay backend ni base de datos externa
- Los datos permanecen en el dispositivo del usuario
- Se puede exportar a JSON para backup

## 💡 Preguntas frecuentes

**¿Se pueden usar menos de 9 participantes?**
Sí, modifica la lógica en `setup.js` para aceptar cualquier cantidad.

**¿Los códigos caducan?**
No, los códigos son permanentes mientras no se reinicie la sesión.

**¿Se puede pausar el ejercicio?**
Sí, cada participante puede cerrar el navegador y continuar después con su código.

**¿Funciona sin internet?**
Sí, una vez cargada la primera vez, funciona offline.

## 📝 Licencia

Libre para uso educativo y empresarial.

## 🤝 Créditos

Basado en la **Ventana de Johari** de Joseph Luft y Harry Ingham (1955).
