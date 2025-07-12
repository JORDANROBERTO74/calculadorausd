# 💰 APIs de Precio P2P del Dólar para Bolivia

## 📊 Plataformas P2P Integradas en la Calculadora

### 1. **Binance P2P** (Recomendada)

```javascript
URL: https://api.exchangerate-api.com/v4/latest/USD
```

- ✅ **Gratuita** sin registro
- ✅ **Sin límites** para uso básico
- ✅ **Actualización** en tiempo real
- ✅ **Soporte** para múltiples monedas

**Respuesta:**

```json
{
  "rates": {
    "BOB": 6.97,
    "EUR": 0.85,
    "GBP": 0.73
  },
  "base": "USD",
  "date": "2024-01-15"
}
```

### 2. **Fixer.io** (Gratuita con límites)

```javascript
URL: https://api.fixer.io/latest?base=USD&symbols=BOB
```

- ✅ **Gratuita** (1000 requests/mes)
- ✅ **Datos oficiales** de bancos centrales
- ⚠️ **Límite** de requests mensuales

### 3. **Open Exchange Rates** (Gratuita)

```javascript
URL: https://open.er-api.com/v6/latest/USD
```

- ✅ **Gratuita** sin registro
- ✅ **Sin límites** conocidos
- ✅ **Datos confiables**

## 🔗 APIs Específicas para Bolivia

### 4. **Banco Central de Bolivia** (Oficial)

```javascript
URL: https://www.bcb.gob.bo/?q=node/165
```

- ✅ **Datos oficiales** del BCB
- ⚠️ **Requiere scraping** (no API directa)
- ⚠️ **Actualización** diaria

### 5. **APIs de Casas de Cambio**

```javascript
// Ejemplos de casas de cambio locales
- Cambios Bolivia
- Cambios América
- Cambios Universal
```

## 💰 APIs de Criptomonedas

### 6. **Binance API** (USDT/BOB)

```javascript
URL: https://api.binance.com/api/v3/ticker/price?symbol=USDTBOB
```

- ✅ **Tiempo real**
- ✅ **Sin límites**
- ⚠️ **Par USDT/BOB** puede no estar disponible

### 7. **CoinGecko API**

```javascript
URL: https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=bob
```

- ✅ **Gratuita** con límites
- ✅ **Múltiples exchanges**
- ⚠️ **Rate limiting**

## 🛠️ Implementación en la Calculadora

### Función Principal

```javascript
async function obtenerPrecioDolar() {
  const apis = [
    {
      name: "Exchange Rate API",
      url: "https://api.exchangerate-api.com/v4/latest/USD",
      parser: (data) => data.rates.BOB,
    },
    {
      name: "Fixer.io",
      url: "https://api.fixer.io/latest?base=USD&symbols=BOB",
      parser: (data) => data.rates.BOB,
    },
    {
      name: "Open Exchange Rates",
      url: "https://open.er-api.com/v6/latest/USD",
      parser: (data) => data.rates.BOB,
    },
  ];

  // Intenta cada API en orden
  for (const api of apis) {
    try {
      const response = await fetch(api.url);
      const data = await response.json();
      const rate = api.parser(data);

      if (rate && rate > 0) {
        return rate;
      }
    } catch (error) {
      console.log(`Error con ${api.name}:`, error);
      continue;
    }
  }
}
```

## 📈 APIs Adicionales Recomendadas

### 8. **Currency Layer** (Pago)

```javascript
URL: https://api.currencylayer.com/live?access_key=YOUR_KEY&currencies=BOB
```

- 💰 **Plan gratuito**: 100 requests/mes
- 💰 **Plan pago**: Desde $9.99/mes
- ✅ **Datos muy precisos**

### 9. **Alpha Vantage** (Pago)

```javascript
URL: https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BOB&apikey=YOUR_KEY
```

- 💰 **Plan gratuito**: 500 requests/día
- 💰 **Plan pago**: Desde $49.99/mes
- ✅ **Datos de alta calidad**

### 10. **APIs de Plataformas de Cambio**

#### **AirTM API** (No oficial)

```javascript
// AirTM no tiene API pública oficial
// Se puede usar web scraping para obtener precios
URL: https://airtm.com/bo/rates
```

#### **Binance P2P** (No oficial)

```javascript
// Binance P2P no tiene API pública
// Se puede usar web scraping
URL: https://p2p.binance.com/es/trade/all-payments/USDT?fiat=BOB
```

## 🔧 Configuración Avanzada

### Agregar Nueva API

```javascript
// En script.js, agregar a la lista de APIs:
{
  name: 'Nueva API',
  url: 'https://api.ejemplo.com/latest/USD',
  parser: (data) => data.rates.BOB,
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}
```

### Manejo de Errores

```javascript
try {
  const response = await fetch(api.url, {
    headers: api.headers || {},
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const rate = api.parser(data);

  if (rate && rate > 0) {
    return rate;
  }
} catch (error) {
  console.log(`Error con ${api.name}:`, error.message);
  return null;
}
```

## 📊 Comparación de APIs

| API                 | Gratuita | Límites  | Precisión | Velocidad  |
| ------------------- | -------- | -------- | --------- | ---------- |
| Exchange Rate API   | ✅       | No       | Alta      | Rápida     |
| Fixer.io            | ✅       | 1000/mes | Muy Alta  | Media      |
| Open Exchange Rates | ✅       | No       | Alta      | Rápida     |
| Binance             | ✅       | No       | Variable  | Muy Rápida |
| Currency Layer      | ❌       | 100/mes  | Muy Alta  | Rápida     |

## 🚀 Mejoras Futuras

### 1. **Cache Local**

```javascript
// Guardar precio en localStorage
localStorage.setItem("lastExchangeRate", rate);
localStorage.setItem("lastUpdate", Date.now());
```

### 2. **Actualización Automática**

```javascript
// Actualizar cada 5 minutos
setInterval(obtenerPrecioDolar, 5 * 60 * 1000);
```

### 3. **Múltiples Fuentes**

```javascript
// Promedio de múltiples APIs
const rates = await Promise.all(apis.map((api) => fetchRate(api)));
const averageRate =
  rates.filter((r) => r).reduce((a, b) => a + b) / rates.length;
```

### 4. **Notificaciones de Cambio**

```javascript
// Alertar cuando el precio cambie significativamente
if (Math.abs(newRate - oldRate) / oldRate > 0.05) {
  mostrarNotificacion(
    "⚠️ El precio del dólar ha cambiado significativamente",
    "warning"
  );
}
```

## 📞 Soporte

Para problemas con las APIs:

- Revisa la **consola del navegador** para errores
- Verifica la **conectividad a internet**
- Comprueba los **límites de rate limiting**
- Considera usar **APIs de pago** para mayor confiabilidad

---

**💡 Consejo**: La calculadora intenta automáticamente múltiples APIs para garantizar que siempre tengas un precio actualizado del dólar.
