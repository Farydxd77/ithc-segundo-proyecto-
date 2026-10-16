# Decisiones de interacción (clase 16)

Funcionalidad: encontrar una convocatoria y postularse.

Revisamos la lista de convocatorias, los filtros y la tarjeta de cada convocatoria con tres principios: Fitts (alcanzar), Hick (elegir) y carga cognitiva (comprender).

| Hallazgo | Captura | Justificación | Estado |
|---|---|---|---|
| Fitts | Quitar un filtro activo | El botón ✕ mide 23 x 18 px y solo esa parte se puede tocar | Documentado |
| Hick | Panel de filtros | Seis controles aparecen a la vez antes de ver una sola convocatoria | Documentado |
| Carga cognitiva | Cupos en la tarjeta | Hay que restar "4/5" para saber cuántos cupos quedan | Corregido |

## Fitts

Pantalla: Dashboard, etiquetas de filtros activos ("Causa: Salud ✕").  
Qué observamos: para quitar un filtro hay que tocar la ✕. Medimos el botón en la app y mide 23 x 18 px. El resto de la etiqueta no hace nada al tocarla.  
Justificación: el objetivo es pequeño y el área activa es solo el ícono, así que exige apuntar con precisión, sobre todo en el celular.  
Código: [FiltrosConvocatorias.tsx](../frontend/ithc/src/anuncios/components/FiltrosConvocatorias.tsx#L76), [index.css](../frontend/ithc/src/index.css)  
Captura:

![](evidencias/clase-16/fitts-quitar-filtro.png)

## Hick

Pantalla: Dashboard, panel de filtros.  
Qué observamos: antes de ver la lista aparecen búsqueda, causa, modalidad, fecha, ubicación y "Solo abiertas y con cupos". Son seis decisiones con la misma importancia.  
Justificación: todas compiten al mismo tiempo. Lo más usado (buscar y ver solo las disponibles) podría quedar visible y el resto ir en "Más filtros".  
Código: [FiltrosConvocatorias.tsx](../frontend/ithc/src/anuncios/components/FiltrosConvocatorias.tsx#L11)  
Captura:

![](evidencias/clase-16/hick-filtros.png)

## Carga cognitiva

Pantalla: tarjeta de una convocatoria, por ejemplo "Apoyo en vacunación comunitaria".  
Qué observamos: la tarjeta dice "4/5 postulados". Para decidir si postularse hay que restar y darse cuenta de que queda un solo cupo. No se distingue una convocatoria con un cupo de una con muchos.  
Justificación: la persona tiene que interpretar y calcular un dato que la app ya conoce. Lo que necesita en ese momento es cuántos cupos quedan.  
Código: [AnuncioCard.tsx](../frontend/ithc/src/anuncios/components/AnuncioCard.tsx#L66)  
Captura:

![](evidencias/clase-16/carga-antes.png)

## Hallazgo elegido

Elegimos carga cognitiva porque aparece en todas las tarjetas, justo cuando la persona decide si se postula. Fitts y Hick quedan documentados para corregir después.

## Corrección

Antes la tarjeta decía "4/5 postulados". Ahora dice directamente cuántos cupos quedan: "Quedan 3 de 5 cupos", "Último cupo" cuando queda uno y "Sin cupos" cuando se llenó. Cuando queda uno o ninguno el texto cambia de color, pero el significado está en las palabras y no depende del color.  
Código: [convocatoria.ts](../frontend/ithc/src/domain/convocatoria.ts#L80) (textoCupos), [AnuncioCard.tsx](../frontend/ithc/src/anuncios/components/AnuncioCard.tsx#L68)  
Pruebas: convocatoria.test.ts (cupos que quedan) y AnuncioCard.test.tsx (la tarjeta muestra los cupos que quedan en lugar de 4/5).  
Comprobación: volvimos a abrir la lista con Daniel y en "Apoyo en vacunación comunitaria" ya se lee "Último cupo" sin tener que calcular.

Antes:

![](evidencias/clase-16/carga-antes.png)

Después:

![](evidencias/clase-16/carga-despues.png)
![](evidencias/clase-16/carga-despues-quedan.png)
