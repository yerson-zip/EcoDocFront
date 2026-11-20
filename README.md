# EcoDoc (frontend)

Portal de documentos de Grupo Gesecol. Los clientes entran con un enlace enviado a su correo y descargan los documentos publicados. El equipo administra clientes, contactos y documentos.

## Puesta en marcha

1. `npm install`
2. Copia `.env.example` a `.env` y ajusta `VITE_API_URL` si la API no corre en `http://localhost:8000`.
3. `npm run dev` (abre en `http://localhost:3000`).

En el backend, `FRONTEND_URL` y `CORS_ORIGINS` deben apuntar a la misma dirección del frontend.

## Rutas

- `/acceso`: el cliente pide su enlace de acceso.
- `/portal`: documentos publicados del cliente.
- `/admin/login`: ingreso del equipo.
- `/admin`: clientes.
- `/admin/clientes/:id`: documentos, contactos y actividad de un cliente.
