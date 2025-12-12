# 🏗️ React Grid Engine

Un motor de diseño de cuadrícula (Grid Layout) de alto rendimiento para React, diseñado específicamente para **Page Builders** y **CMS**. Soporta Drag & Drop nativo, redimensionamiento fluido, integración con Iframes y múltiples instancias.

## 🚀 Características Principales

- **Drag & Drop Híbrido:** Funciona dentro y fuera de Iframes (usando `dispatchEvent` y `postMessage`).
- **Resize Avanzado:** Redimensionamiento desde 8 puntos con límites (`min/max width/height`).
- **Snap to Grid:** Alineación automática magnética a columnas y filas.
- **Gestión de Colisiones:** Los elementos se empujan y reacomodan automáticamente.
- **Agnóstico:** No depende de los componentes internos del CMS.
- **Canvas Resizable:** Permite al usuario ajustar la altura del lienzo de trabajo.
- **Event Hooks:** Sistema de eventos para conectar con bases de datos o lógica de negocio externa.
- **UI Inyectable:** Soporte para menús contextuales personalizados (ej: botón eliminar).

---

## 📦 Instalación

Asegúrate de tener las dependencias necesarias:

```bash
npm install framer-motion @use-gesture/react uuid lucide-react
# o
yarn add framer-motion @use-gesture/react uuid lucide-react
```

Importa los estilos globales en tu punto de entrada (ej: `App.tsx` o `index.tsx`):

```tsx
import "./grid-engine/styles/styles.scss";
```

---

## 🛠️ Uso Básico

Para implementar una grilla básica:

```tsx
import {
  GridEngineProvider,
  GridContainer,
  type IGridConfig,
} from "./grid-engine";

const myConfig: IGridConfig = {
  cols: 12, // Número de columnas
  rows: 60, // Altura inicial en filas
  rowHeight: 50, // Altura de cada fila en px
  gap: { col: 10, row: 10 }, // Espacio entre celdas
};

export const MyPageBuilder = () => {
  return (
    <GridEngineProvider id="main-grid" gridConfig={myConfig}>
      <GridContainer />
    </GridEngineProvider>
  );
};
```

---

## 📚 API Reference

### 1. `GridEngineProvider`

El componente principal que maneja el estado, la lógica y los eventos.

| Propiedad                    | Tipo                                   | Requerido | Descripción                                                                 |
| :--------------------------- | :------------------------------------- | :-------: | :-------------------------------------------------------------------------- |
| **`id`**                     | `string`                               |    ✅     | Identificador único de la grilla. Vital para múltiples instancias.          |
| **`gridConfig`**             | `IGridConfig`                          |    ✅     | Configuración de columnas, filas y espacios.                                |
| **`initialLayout`**          | `IGridItem[]`                          |    ❌     | Array de items para cargar un diseño guardado.                              |
| **`onEvent`**                | `(payload: IGridEventPayload) => void` |    ❌     | Hook para escuchar cambios (Mover, Resize, Borrar).                         |
| **`selectionMenuComponent`** | `ComponentType<ISelectionMenuProps>`   |    ❌     | Componente React para renderizar un menú contextual al seleccionar un item. |

#### Ejemplo de Configuración (`IGridConfig`)

```ts
{
  cols: 12,
  rows: 100,
  rowHeight: 30,
  gap: { row: 8, col: 8 }
}
```

---

### 2. `DraggableSource` (Sidebar Items)

Componente para envolver elementos externos (barra lateral) que se pueden arrastrar hacia la grilla.

| Propiedad           | Tipo        | Requerido | Descripción                                                          |
| :------------------ | :---------- | :-------: | :------------------------------------------------------------------- |
| **`w`**             | `number`    |    ✅     | Ancho que ocupará en la grilla (columnas).                           |
| **`h`**             | `number`    |    ✅     | Alto que ocupará en la grilla (filas).                               |
| **`targetGridId`**  | `string`    |    ❌     | ID de la grilla destino. Si se omite, activa todas las grillas.      |
| **`children`**      | `ReactNode` |    ✅     | Lo que se ve en el Sidebar (ej: Icono + Texto).                      |
| **`component`**     | `ReactNode` |    ✅     | El componente real que se renderizará dentro de la grilla al soltar. |
| **`minW` / `maxW`** | `number`    |    ❌     | Límites de redimensionamiento horizontal.                            |
| **`minH` / `maxH`** | `number`    |    ❌     | Límites de redimensionamiento vertical.                              |

#### Ejemplo:

```tsx
import { DraggableSource } from "./grid-engine";

<DraggableSource
  w={4}
  h={2}
  targetGridId="main-grid"
  component={<MyChartComponent />} // Lo que se verá en la grilla
>
  <div className="sidebar-card">Gráfico de Ventas</div>{" "}
  {/* Lo que se ve en el sidebar */}
</DraggableSource>;
```

---

### 3. `IGridItem` (Estructura de Datos)

Así es como se guarda cada elemento internamente.

```typescript
interface IGridItem {
  id: string; // UUID único
  x: number; // Posición columna (0-index)
  y: number; // Posición fila (0-index)
  w: number; // Ancho en columnas
  h: number; // Alto en filas
  minW?: number; // Mínimo ancho permitido
  maxW?: number; // Máximo ancho permitido
  minH?: number; // Mínimo alto permitido
  maxH?: number; // Máximo alto permitido
  component: ReactNode; // El componente renderizado
}
```

---

## ⚡ Funcionalidades Avanzadas

### A. Sistema de Eventos (`onEvent`)

Permite al CMS reaccionar a cambios en la grilla para guardar en base de datos o ejecutar lógica de negocio.

```tsx
const handleGridEvent = (event: IGridEventPayload) => {
  const { type, items, item } = event;

  switch (type) {
    case "ITEM_MOVED":
    case "ITEM_RESIZED":
      console.log("Layout modificado, guardando...", items);
      break;

    case "ITEM_ADDED":
      console.log("Nuevo elemento agregado:", item);
      break;

    case "ITEM_DELETED":
      console.log("Elemento eliminado");
      break;
  }
};

// Uso
<GridEngineProvider onEvent={handleGridEvent} ... >
```

### B. Menú Contextual (Custom UI Injection)

Puedes inyectar tu propio menú de opciones (Eliminar, Configurar, Duplicar) que aparecerá sobre el elemento seleccionado.

**1. Crea tu componente de menú:**

```tsx
const MyContextMenu = ({ item, dispatch }: ISelectionMenuProps) => {
  return (
    <div className="my-custom-menu">
      <button
        onClick={() =>
          dispatch({ type: "REMOVE_ITEM", payload: { id: item.id } })
        }
      >
        🗑️ Eliminar
      </button>
    </div>
  );
};
```

**2. Pásalo al Provider:**

```tsx
<GridEngineProvider selectionMenuComponent={MyContextMenu} ... >
```

### C. Soporte para Iframes (CMS Preview)

Esta librería utiliza un sistema híbrido de comunicación:

1.  **Mismo Contexto:** Usa `window.dispatchEvent` y `CustomEvent`.
2.  **Iframe:** Usa `window.postMessage` para despertar la grilla desde fuera.

Para usar la grilla dentro de un Iframe, simplemente asegúrate de renderizar el `GridEngineProvider` dentro del Iframe (o usando un Portal). El `DraggableSource` se encargará automáticamente de enviar las señales a través de la frontera del iframe.

---

## 💡 Tips de Desarrollo

- **Identificadores:** Siempre usa `gridId` si tienes más de una grilla en pantalla (ej: Header vs Body) para evitar que al arrastrar un elemento se activen ambas.
- **Estilos:** El contenedor de la grilla usa `ResizeObserver`. Asegúrate de que el padre tenga un ancho definido o sea flexible (block/flex) para que la grilla pueda calcular sus columnas.
- **Z-Index:**
  - `10`: Item seleccionado.
  - `20`: Item siendo arrastrado.
  - `100`: Menú contextual inyectado.
