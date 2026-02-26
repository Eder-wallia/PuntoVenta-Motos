# 🏍️ Sistema de Registro de Motos (Frontend)

Aplicación web para el registro y gestión de motos con soporte **offline-first**, historial de trabajos y generación de PDF descargable.

El sistema utiliza **arquitectura HOC (High Order Component)** para autenticación y control de acceso, junto con un enfoque **offline-first** para evitar pérdida de datos.

---

# 🚀 Características

✅ Login protegido con HOC
✅ Registro de motos
✅ Registro de trabajos realizados
✅ Historial de trabajos por moto
✅ Generación de PDF descargable
✅ Soporte offline-first
✅ Sincronización automática al recuperar conexión
✅ Cola de operaciones offline
✅ Arquitectura escalable

---

# 🧠 Arquitectura

## 📌 Arquitectura HOC

Se usa un HOC para:

* Proteger rutas
* Validar sesión
* Inyectar usuario autenticado
* Reutilizar lógica de autenticación

```js
const withAuth = (Component) => {
  return (props) => {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" />;

    return <Component {...props} />;
  };
};
```

---

# ⭐ Arquitectura Offline-First

La app sigue este flujo:

```
UI → IndexedDB → Sync Queue → API Backend → MongoDB
```

👉 Primero guarda en local
👉 Luego sincroniza con backend
👉 Garantiza cero pérdida de datos

---

# 🏗️ Estructura del proyecto

```
src/
 ├── api/
 ├── components/
 ├── hoc/
 │    └── withAuth.jsx
 ├── offline/
 │    ├── db.js
 │    ├── syncQueue.js
 │    └── syncService.js
 ├── pages/
 ├── services/
 ├── utils/
 │    └── pdfGenerator.js
 └── App.jsx
```

---

# 💾 Persistencia offline

Se utiliza:

👉 IndexedDB
👉 LocalStorage (token)
👉 Service Worker

---

# 📦 IndexedDB setup

```js
import { openDB } from "idb";

export const dbPromise = openDB("motos-db", 1, {
  upgrade(db) {
    db.createObjectStore("motos", { keyPath: "_id" });
    db.createObjectStore("trabajos", { keyPath: "_id" });
    db.createObjectStore("syncQueue", { autoIncrement: true });
  },
});
```

---

# 🔄 Cola de sincronización offline

Cuando no hay internet:

👉 se guarda operación en `syncQueue`

```js
export const addToQueue = async (operation) => {
  const db = await dbPromise;
  await db.add("syncQueue", operation);
};
```

---

# 🌐 Servicio de sincronización

Cuando vuelve conexión:

```js
window.addEventListener("online", async () => {
  await syncPendingOperations();
});
```

👉 envía operaciones pendientes al backend

---

# 🏍️ Modelo de datos

## Moto

```js
{
  _id,
  marca,
  modelo,
  anio,
  color,
  vin,
  placa,
  propietario,
  createdAt
}
```

## Trabajo

```js
{
  _id,
  motoId,
  descripcion,
  costo,
  fecha,
  notas
}
```

---

# � Sistema de Autenticación

El sistema implementa login seguro con **JWT** y protección de rutas mediante **HOC**:

## Componentes

- **Login Page**: Formulario de autenticación
- **authService**: Gestión de login/logout y persistencia de sesión
- **withAuth HOC**: Protección de rutas privadas

Ver [AUTHENTICATION.md](./AUTHENTICATION.md) para documentación detallada.

### Quick Start

1. **Configurar URL del API** en `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

2. **El backend debe tener estos endpoints**:
   - `POST /api/auth/login` - Login de usuario
   - `POST /api/auth/register` - Registro (opcional)

3. **El frontend redirige automáticamente**:
   - No autenticado → `/login`
   - Autenticado → `/dashboard`

---

# �📑 Generación de PDF

Se genera PDF con:

✅ Datos de moto
✅ Historial de trabajos
✅ Fecha de generación

```js
import jsPDF from "jspdf";

export const generateMotoPDF = (moto, trabajos) => {
  const doc = new jsPDF();

  doc.text(`Moto: ${moto.marca} ${moto.modelo}`, 10, 10);

  trabajos.forEach((t, i) => {
    doc.text(`${i+1}. ${t.descripcion}`, 10, 20 + i * 10);
  });

  doc.save("moto.pdf");
};
```

---

# 📋 Requisitos previos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0
- Backend API ejecutándose (ver endpoints en AUTHENTICATION.md)

---

# ⚙️ Instalación

1. **Clona el repositorio**:
```bash
git clone https://github.com/tu-usuario/PuntoVenta-Motos.git
cd PuntoVenta-Motos
```

2. **Instala dependencias**:
```bash
npm install
```

3. **Configura variables de entorno**:
```bash
cp .env.example .env
# Edita .env con la URL correcta del backend
```

---

# ▶️ Ejecución

**Desarrollo**:
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173)

**Build para producción**:
```bash
npm run build
```

**Preview de producción**:
```bash
npm run preview
```

---

# 🔧 Variables de entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# ⭐ Estrategia de sincronización

El sistema usa:

✅ cola offline
✅ retry automático
✅ detección de conexión
✅ estrategia last-write-wins
✅ UUID temporal para registros offline

---

# ⭐ Buenas prácticas offline

👉 Generar ID temporal
👉 Guardar timestamps
👉 Marcar registros sincronizados
👉 Manejar conflictos
👉 Retry con backoff

---

---

# 🚀 Mejoras futuras

* Adjuntar imágenes a trabajos
* Auditoría
* Exportación Excel
* Notificaciones push
* Multi sucursal
* Cache avanzada
* CRDT para conflictos
* Background sync
* PWA completa

---

# 🛠️ Troubleshooting

## "Error de conexión al API"
- ✅ Verifica que el backend está ejecutándose en `VITE_API_URL`
- ✅ Revisa la consola del navegador (F12) para ver errores detallados
- ✅ Asegúrate que CORS está habilitado en el backend

## "Login no funciona"
- ✅ Verifica credenciales
- ✅ Confirma que `/api/auth/login` existe en el backend
- ✅ El endpoint debe devolver `{ token, user }`

## "Ruta protegida redirige a login"
- ✅ El HOC verifica `localStorage.getItem('token')`
- ✅ Después del login, limpia el navegador (F12 → Application → Clear Storage)
- ✅ Recarga la página

## "localhost:5173 no carga"
- ✅ Puerto 5173 ocupado: `npm run dev -- --port 3001`
- ✅ Firewall bloqueando puerto: ciérralo temporalmente

---

# 📌 Stack

* React 19.2
* React Router 7
* Axios
* idb (para offline)
* jsPDF (para PDF)
* Service Worker
* IndexedDB
* Vite

---

# 👨‍💻 Autor

Sistema interno de gestión de motos con soporte offline tipo POS.

---

# 📝 Licencia

Proyecto interno. Todos los derechos reservados.

