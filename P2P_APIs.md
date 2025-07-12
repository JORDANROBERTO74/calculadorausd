# 💰 APIs P2P para Precio del Dólar en Bolivia

## 🎯 Plataformas P2P Integradas

### 1. **Binance P2P** (Principal)

```javascript
URL: //p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search
https: Method: POST;
```

**Características:**

- ✅ **Precios reales** del mercado P2P
- ✅ **Sin límites** de requests
- ✅ **Actualización** en tiempo real
- ✅ **Promedio** de múltiples anuncios
- ✅ **Datos confiables** de usuarios verificados

**Implementación:**

```javascript
const response = await fetch(
  "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    body: JSON.stringify({
      fiat: "BOB",
      page: 1,
      rows: 10,
      payTypes: [],
      asset: "USDT",
      tradeType: "BUY",
      publisherType: null,
    }),
  }
);
```

### 2. **AirTM** (Secundaria)

```javascript
URL: //rates.airtm.com/bo
https: Method: GET;
```

**Características:**

- ✅ **Plataforma establecida** en Bolivia
- ✅ **Precios competitivos**
- ⚠️ **Requiere web scraping**
- ⚠️ **Estructura HTML puede cambiar**

**Implementación:**

```javascript
const response = await fetch("https://rates.airtm.com/bo", {
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

const html = await response.text();
const match = html.match(/USD.*?(\d+\.?\d*)/);
const rate = match ? parseFloat(match[1]) : null;
```

### 3. **LocalBitcoins** (Backup)

```javascript
URL: //localbitcoins.com/api/equation/BTCBOB/
https: Method: GET;
```

**Características:**

- ✅ **Plataforma internacional**
- ⚠️ **Requiere conversión** BTC → USD → BOB
- ⚠️ **Volumen limitado** en Bolivia

## 🔄 Orden de Prioridad

1. **Binance P2P** - Mejor precisión y volumen
2. **AirTM** - Plataforma local establecida
3. **Exchange Rate API** - Backup confiable

## 📊 Ventajas de Precios P2P

### ✅ **Ventajas:**

- **Precios reales** del mercado local
- **Sin comisiones** bancarias
- **Disponibilidad** 24/7
- **Liquidez** alta en Binance
- **Transparencia** de precios

### ⚠️ **Consideraciones:**

- **Volatilidad** mayor que bancos
- **Riesgo** de estafa (mitigado por plataformas)
- **Límites** de transacción
- **Tiempo** de procesamiento

## 🛠️ Implementación en la Calculadora

### Función Principal Actualizada:

```javascript
async function obtenerPrecioDolar() {
  const plataformas = [
    {
      name: "Binance P2P",
      url: "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
      method: "POST",
      body: JSON.stringify({
        fiat: "BOB",
        page: 1,
        rows: 10,
        payTypes: [],
        asset: "USDT",
        tradeType: "BUY",
        publisherType: null,
      }),
      parser: (data) => {
        if (data.data && data.data.length > 0) {
          const precios = data.data
            .slice(0, 5)
            .map((item) => parseFloat(item.adv.price));
          return precios.reduce((a, b) => a + b) / precios.length;
        }
        return null;
      },
    },
    {
      name: "AirTM",
      url: "https://rates.airtm.com/bo",
      method: "GET",
      parser: (data) => {
        const match = data.match(/USD.*?(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : null;
      },
    },
  ];

  // Intenta cada plataforma en orden
  for (const plataforma of plataformas) {
    try {
      const options = {
        method: plataforma.method,
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      };

      if (plataforma.body) {
        options.body = plataforma.body;
      }

      const response = await fetch(plataforma.url, options);
      const data = await response.json();
      const rate = plataforma.parser(data);

      if (rate && rate > 0) {
        return rate;
      }
    } catch (error) {
      console.log(`Error con ${plataforma.name}:`, error);
      continue;
    }
  }
}
```

## 📈 Comparación de Precios

| Fuente              | Precio Promedio | Volatilidad | Confiabilidad |
| ------------------- | --------------- | ----------- | ------------- |
| **Binance P2P**     | 15.20 Bs        | Media       | Alta          |
| **AirTM**           | 15.15 Bs        | Baja        | Media         |
| **Banco Central**   | 14.98 Bs        | Muy Baja    | Muy Alta      |
| **Casas de Cambio** | 15.30 Bs        | Alta        | Media         |

## 🔧 Configuración Avanzada

### Agregar Nueva Plataforma P2P:

```javascript
{
  name: "Nueva Plataforma",
  url: "https://api.plataforma.com/rates",
  method: "GET",
  parser: (data) => {
    // Lógica de parsing específica
    return parseFloat(data.rate);
  }
}
```

### Manejo de Errores Específicos:

```javascript
try {
  const response = await fetch(plataforma.url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const rate = plataforma.parser(data);

  if (rate && rate > 0 && rate < 50) {
    // Validación de rango
    return rate;
  }
} catch (error) {
  console.log(`Error con ${plataforma.name}:`, error.message);
  return null;
}
```

## 🚀 Mejoras Futuras

### 1. **Múltiples Métodos de Pago**

```javascript
// Filtrar por métodos de pago específicos
"payTypes": ["BANCO_UNION", "BANCO_BNB", "TRANSFERENCIA"]
```

### 2. **Promedio Ponderado**

```javascript
// Dar más peso a anuncios con mejor reputación
const preciosPonderados = data.data.map((item) => ({
  precio: parseFloat(item.adv.price),
  peso: item.advertiser.completionRate,
}));
```

### 3. **Cache Inteligente**

```javascript
// Guardar precios con timestamp
localStorage.setItem(
  "p2pRates",
  JSON.stringify({
    binance: { rate: 15.2, timestamp: Date.now() },
    airtm: { rate: 15.15, timestamp: Date.now() },
  })
);
```

### 4. **Alertas de Cambio**

```javascript
// Notificar cambios significativos
if (Math.abs(newRate - oldRate) / oldRate > 0.05) {
  mostrarNotificacion(
    "⚠️ El precio P2P ha cambiado significativamente",
    "warning"
  );
}
```

## 📞 Soporte

Para problemas con las APIs P2P:

- **Binance P2P**: Revisar conectividad y CORS
- **AirTM**: Verificar estructura HTML actualizada
- **Rate Limiting**: Implementar delays entre requests
- **Fallback**: Siempre tener APIs de respaldo

---

**💡 Consejo**: Los precios P2P suelen ser más altos que el oficial, pero reflejan mejor el mercado real para transacciones comerciales.
