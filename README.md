# 💰 Calculadora de Transacciones Comerciales

Una calculadora web moderna y funcional para calcular ganancias, comisiones y reintegros de transacciones comerciales en Bolivianos (Bs) y Dólares (USD).

## 🚀 Características

### ✨ Funcionalidades Principales

- **Cálculo automático** de ganancias y comisiones
- **Múltiples pagos** con interfaz dinámica
- **Validación de datos** en tiempo real
- **Formato de moneda** automático (Bs)
- **Diseño responsive** para móviles y desktop
- **Exportación de resultados** a archivo de texto

### 🎨 Interfaz Moderna

- Diseño limpio y profesional
- Animaciones suaves
- Colores intuitivos por sección
- Iconos descriptivos
- Gradientes y efectos visuales

### 📊 Cálculos Incluidos

- **Entrada de dinero**: Total de pagos realizados
- **Venta**: Conversión USD a Bs
- **Comisiones**: Porcentaje configurable
- **Ganancias**: Bruta e individual
- **Reintegro final**: Ganancia + inversión recuperada

## 🛠️ Cómo Usar

### 1. Abrir la Calculadora

```bash
# Simplemente abre el archivo index.html en tu navegador
```

### 2. Ingresar Datos

1. **Tipo de Cambio**: Valor actual USD/Bs (ej: 14.98)
2. **Dólares Obtenidos**: Cantidad de USD de la venta
3. **Pagos**: Agregar cada pago realizado en Bs
4. **Comisión**: Porcentaje que cobra la plataforma
5. **Ganancia Individual**: Porcentaje que te corresponde

### 3. Calcular

- Haz clic en "🧮 Calcular Transacción"
- Los resultados aparecerán automáticamente
- Scroll suave a la sección de resultados

### 4. Funciones Adicionales

- **📋 Cargar Ejemplo**: Usa los datos del mensaje original
- **🗑️ Limpiar**: Borra todos los campos
- **📄 Exportar**: Descarga resultados como archivo .txt

## 📱 Responsive Design

La calculadora funciona perfectamente en:

- 📱 Móviles (Android/iOS)
- 💻 Tablets
- 🖥️ Desktop
- 🌐 Todos los navegadores modernos

## 🎯 Ejemplo de Uso

### Datos de Entrada:

- Tipo de cambio: 14.98 Bs/USD
- Dólares obtenidos: 90 USD
- Pagos: 324.12 Bs + 324.12 Bs
- Comisión plataforma: 30%
- Ganancia individual: 70%

### Resultados Esperados:

- **Total Invertido**: 648.24 Bs
- **Total de Venta**: 1.348.20 Bs
- **Comisión**: 404.46 Bs
- **Ganancia Individual**: 660.62 Bs
- **Reintegro Final**: 1.308.86 Bs

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con Flexbox y Grid
- **JavaScript ES6+**: Lógica de cálculo y interactividad
- **Intl API**: Formateo de moneda local
- **CSS Grid**: Layout responsive
- **CSS Animations**: Efectos visuales

## 📁 Estructura de Archivos

```
calculadora_usd/
├── index.html          # Estructura principal
├── styles.css          # Estilos y diseño
├── script.js           # Lógica y funcionalidad
└── README.md          # Documentación
```

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
  --primary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
}
```

### Modificar Cálculos

Los cálculos principales están en `script.js`:

- `calcularTransaccion()`: Función principal
- `mostrarResultados()`: Mostrar resultados
- `validarDatos()`: Validaciones

## 🚀 Instalación

1. **Descarga** los archivos
2. **Abre** `index.html` en tu navegador
3. **¡Listo!** No requiere instalación adicional

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas:

- Abre un issue en GitHub
- Revisa la documentación
- Contacta al desarrollador

---

**¡Disfruta calculando tus transacciones comerciales! 💰✨**
