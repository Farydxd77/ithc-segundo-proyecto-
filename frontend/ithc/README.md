# Voluntariado Cerca

Aplicación para publicar y gestionar convocatorias de voluntariado.

## Cómo ejecutar el proyecto

```bash
cd frontend/ithc
npm install
npm run dev
```

### Variables de entorno

La URL del backend se configura en `frontend/ithc/.env` (no se sube al repo). Copia el ejemplo:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:8089/api` |

En el backend, el origen permitido por CORS se lee de `app.frontend-url` en `application.properties`
(se puede sobrescribir con la variable de entorno `FRONTEND_URL`). Por defecto acepta `localhost` y `127.0.0.1` en cualquier puerto.

## Nueva funcionalidad: Cerrar convocatoria

Cada anuncio se crea con la convocatoria **abierta**. En el Dashboard aparece la lista de anuncios
y el botón **Cerrar convocatoria**, que cambia el estado a **cerrada**. El cambio se guarda en
`localStorage`, por eso se conserva después de recargar la página.

## Nueva funcionalidad: Reabrir convocatoria

Si la convocatoria está **cerrada**, quien creó el anuncio ve el botón **Reabrir convocatoria**,
que la devuelve al estado **abierta** (endpoint `POST /anuncios/{id}/reabrir`). Los voluntarios ya
inscritos se conservan y se vuelven a aceptar inscripciones mientras queden cupos. No se puede
reabrir una convocatoria que ya está abierta.

La regla de cambio de estado está en `src/domain/convocatoria.ts`.

## Pruebas unitarias

Las pruebas están en `src/domain/convocatoria.test.ts` y usan Vitest.

Comando para ejecutar las pruebas:

```bash
cd frontend/ithc
npm install
npm test
```

Pruebas incluidas:

1. El estado inicial es abierta.
2. Cerrar convocatoria cambia el estado de abierta a cerrada.
3. No se puede cerrar una convocatoria que ya está cerrada.
4. Los demás datos del anuncio se conservan.
