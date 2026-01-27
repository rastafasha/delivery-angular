# TODO - Implementar Mapa con Coordenadas en DireccionEdit

## Progreso
- [x] 1. Modificar direccion.model.ts - agregar campos lat/lng
- [x] 2. Modificar direccion-edit.component.ts - agregar funcionalidad de mapa
- [x] 3. Modificar direccion-edit.component.html - agregar contenedor del mapa
- [x] 4. Modificar direccion-edit.component.css - estilos del mapa

## Implementación Completada

### Archivos modificados:
1. `src/app/models/direccion.model.ts` - Agregados campos `latitud` y `longitud`
2. `src/app/pages/profile/direcciones/direccion-edit/direccion-edit.component.ts` - Funcionalidad completa de mapa
3. `src/app/pages/profile/direcciones/direccion-edit/direccion-edit.component.html` - Contenedor del mapa y UI
4. `src/app/pages/profile/direcciones/direccion-edit/direccion-edit.component.css` - Estilos del mapa

### Características implementadas:
- Mapa interactivo con Leaflet
- Click en el mapa para seleccionar ubicación
- Botón "Usar mi ubicación actual" con geolocalización
- Marcador en la ubicación seleccionada
- Coordenadas guardadas en campo referencia
- Carga de coordenadas existentes al editar
- Compatible con direcciones sin coordenadas previas
- Diseño responsive

