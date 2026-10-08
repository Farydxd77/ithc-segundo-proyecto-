# Voluntariado Cerca

Aplicación para publicar y gestionar convocatorias de voluntariado.

## Cómo ejecutar el proyecto

```bash
cd frontend/ithc
npm install
npm run dev
```

## Nueva funcionalidad: Cerrar convocatoria

Cada anuncio se crea con la convocatoria **abierta**. En el Dashboard aparece la lista de anuncios
y el botón **Cerrar convocatoria**, que cambia el estado a **cerrada**. El cambio se guarda en
`localStorage`, por eso se conserva después de recargar la página.

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
