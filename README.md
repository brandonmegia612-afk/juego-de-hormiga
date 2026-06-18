# 🐜 Hormiga Quest - Juego de Supervivencia

Un juego de estrategia y supervivencia donde diriges una colonia de hormigas, recolectas comida, subes de nivel y luchas contra arañas enemigas.

## 🎮 Características

### ✨ Sistema de Hormiga Mejorado
- **Diseño Visual Realista**: Las hormigas tienen abdomen, tórax, cabeza, antenas, ojos y 6 patas detalladas
- **Colonia Dinámica**: Crea hasta 5 hormigas haciendo clic en la pantalla
- **Sistema de Salud**: Las hormigas pierden vida al contacto con arañas

### 🍖 Sistema de Comida
- Recolecta comida esparcida por el mapa
- La comida se regenera automáticamente cuando la cantidad baja
- Gana XP al recolectar comida
- La salud se regenera al recolectar comida

### ⭐ Sistema de Nivel Dinámico
- Sube de nivel recolectando comida (cada nivel requiere más XP)
- Los requisitos de XP aumentan con cada nivel
- Cada nivel aumenta tu salud máxima y velocidad

### ⚡ Sistema de Velocidad
- La velocidad base es de 200 unidades/segundo
- Aumenta 30 unidades de velocidad por cada nivel alcanzado
- Visible en el HUD en tiempo real

### 🏰 Sistema de Colonias
- Crea nuevas hormigas haciendo clic en cualquier punto del mapa
- Máximo 5 hormigas por colonia
- Las hormigas adicionales tienen IA simple de movimiento
- Si muere la hormiga principal, Game Over

### 🕷️ Arañas Enemigas
- 4 arañas inteligentes patrullan el mapa
- Las arañas buscan y persiguen a las hormigas cercanas
- Tienen 8 ojos y 8 patas realistas
- Causan daño al contacto (5 puntos por golpe)
- Pueden ser destruidas por las hormigas (2 puntos de daño)

### 📊 HUD Completo
- 🍖 Comida: Total recolectado
- ⭐ Nivel: Nivel actual
- ✨ XP: Experiencia actual / Requerida
- ❤️ Salud: Vida actual / Máxima
- 🐜 Colonia: Hormigas actuales / Máximo
- ⚡ Velocidad: Velocidad actual

## 🎯 Cómo Jugar

### Controles
- **Flechas de teclado**: Mover la hormiga principal
- **Clic izquierdo**: Crear una nueva hormiga en esa posición
- **Botón Volver**: Regresar al menú

### Objetivos
1. Recolecta comida para ganar XP
2. Sube de nivel para aumentar salud y velocidad
3. Crea más hormigas para formar una colonia más fuerte
4. Defiéndete de las arañas enemigas
5. Sobrevive el mayor tiempo posible

### Estrategia
- Mantén tu colonia en movimiento para evitar arañas
- Crea hormigas adicionales en posiciones estratégicas
- Los niveles más altos dan más resistencia
- Recolecta comida constantemente para regenerar salud

## 🌍 Mundos

- **Desierto**: Arena seca y cálida
- **Océano**: Aguas profundas y misteriosas
- **Zona Tóxica**: Área peligrosa y contaminada
- **Bosque**: Frondoso y lleno de vida
- **Volcán**: Territorio volcánico y ardiente

## 🛠️ Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build
npm run preview
```

## 📦 Tecnologías

- **React** - Framework UI
- **Phaser 4** - Motor de juegos
- **Vite** - Bundler y servidor de desarrollo
- **JavaScript** - Lenguaje principal

## 🎨 Sonidos

El juego incluye efectos de sonido generativos basados en Web Audio API:
- Sonido de menú
- Sonido de inicio
- Sonido de regreso
- Sonido de selección

## 📝 Estructura del Proyecto

```
hormiga-game/
├── src/
│   ├── components/         # Componentes React (menú, mundos)
│   ├── game/              # Lógica del juego (Phaser)
│   ├── data/              # Datos del juego (mundos)
│   ├── styles/            # Estilos adicionales
│   ├── utils/             # Utilidades (sonidos)
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
└── package.json           # Dependencias y scripts
```

## 🐛 Resolución de Problemas

### Las hormigas no se ven bien
- Asegúrate de que la resolución del navegador sea compatible
- Intenta actualizar la página (F5)

### Arañas no persiguen
- Las arañas buscan hormigas en un rango de 200 píxeles
- Si estás muy lejos, las arañas se mueven aleatoriamente

### El juego está lento
- Reduce el número de hormigas
- Cierra otras pestañas que usen muchos recursos

## 🎓 Aprendizaje

Este proyecto es perfecto para aprender:
- Desarrollo de juegos con Phaser
- Componentes React
- IA de enemigos simple
- Diseño de UI/UX
- Gestión de estado en juegos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

---

¡Disfruta jugando Hormiga Quest! 🐜🎮
