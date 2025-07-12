// Variables globales
let pagoCounter = 1;
let currentExchangeRate = 7.0; // Tipo de cambio oficial (compra)
let margin = 0.5;

// Función para formatear números como moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Función para obtener el precio del dólar desde plataformas P2P
async function obtenerPrecioDolar(mostrarNotificaciones = true) {
  const rateElement = document.getElementById("tipoCambio");
  const btnPrecioP2P = document.getElementById("btnPrecioP2P");
  const btnPrecioIcon = document.getElementById("btnPrecioIcon");
  const btnPrecioText = document.getElementById("btnPrecioText");

  // Activar estado de carga
  btnPrecioP2P.disabled = true;
  btnPrecioP2P.classList.add("btn-disabled");
  btnPrecioIcon.innerHTML = '<i data-lucide="loader-2"></i>';
  btnPrecioIcon.classList.add("spinner");
  btnPrecioText.textContent = "Obteniendo...";
  rateElement.placeholder = "Obteniendo precio P2P...";
  rateElement.value = "";

  try {
    // Intentar obtener precios de plataformas P2P
    const plataformas = [
      {
        name: "Binance P2P",
        url: "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
        method: "POST",
        body: JSON.stringify({
          asset: "USDT",
          fiat: "BOB",
          tradeType: "SELL",
          page: 1,
          rows: 10,
          payTypes: [],
          publisherType: null,
        }),
        parser: (data) => {
          if (data.data && data.data.length > 0) {
            // Obtener el precio promedio de los primeros 5 anuncios
            const precios = data.data
              .slice(0, 5)
              .map((item) => parseFloat(item.adv.price));
            return precios.reduce((a, b) => a + b) / precios.length;
          }
          return null;
        },
      },
      {
        name: "AirTM (Web Scraping)",
        url: "https://rates.airtm.com/bo",
        method: "GET",
        parser: (data) => {
          // Intentar extraer precio de AirTM (requiere parsing del HTML)
          const match = data.match(/USD.*?(\d+\.?\d*)/);
          return match ? parseFloat(match[1]) : null;
        },
      },
      {
        name: "Exchange Rate API (Backup)",
        url: "https://api.exchangerate-api.com/v4/latest/USD",
        method: "GET",
        parser: (data) => data.rates.BOB,
      },
    ];

    for (const plataforma of plataformas) {
      try {
        console.log(`Intentando ${plataforma.name}...`);

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

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const rate = plataforma.parser(data);

        if (rate && rate > 0) {
          currentExchangeRate = rate;
          // Mostrar en la UI el tipo de cambio menos el margen
          rateElement.value = (rate - margin).toFixed(2);
          rateElement.placeholder = "Tipo de cambio (Bs/USD)";

          // Restaurar estado del botón
          btnPrecioP2P.disabled = false;
          btnPrecioP2P.classList.remove("btn-disabled");
          btnPrecioIcon.innerHTML = '<i data-lucide="dollar-sign"></i>';
          btnPrecioIcon.classList.remove("spinner");
          btnPrecioText.textContent = "Precio P2P";

          // Mostrar notificación de éxito solo si está habilitado
          if (mostrarNotificaciones) {
            mostrarNotificacion(
              `Precio P2P actualizado (${plataforma.name}): ${formatCurrency(
                rate - margin
              )}`,
              "success"
            );
          }

          return rate - margin;
        }
      } catch (error) {
        console.log(`Error con ${plataforma.name}:`, error.message);
        continue;
      }
    }

    // Si ninguna plataforma funciona, usar valor por defecto
    throw new Error("No se pudo obtener el precio P2P actual");
  } catch (error) {
    console.error("Error obteniendo precio P2P:", error);

    // Restaurar estado del botón
    btnPrecioP2P.disabled = false;
    btnPrecioP2P.classList.remove("btn-disabled");
    btnPrecioIcon.innerHTML = '<i data-lucide="dollar-sign"></i>';
    btnPrecioIcon.classList.remove("spinner");
    btnPrecioText.textContent = "Precio P2P";
    rateElement.placeholder = "Tipo de cambio (Bs/USD)";

    if (mostrarNotificaciones) {
      mostrarNotificacion(
        "No se pudo obtener el precio P2P. Usando valor por defecto.",
        "warning"
      );
    }
    return currentExchangeRate;
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.className = `notificacion ${tipo}`;
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
  /* Estilos para móvil */
    @media (max-width: 768px) {
      top: 50%;
      left: 0px;
      right: 0;
      transform: translate(-50%, -50%);
      max-width: 100%;
      min-width: 300px;
      width: 100%;
      text-align: center;
      border-radius: 0;
      margin: 0;
    }

    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    min-width: 300px;
    
    
  `;

  // Colores según tipo
  const colores = {
    success: "#00C851",
    warning: "#FFB100",
    error: "#FF4444",
    info: "#245BDD",
  };

  notificacion.style.background = colores[tipo] || colores.info;

  // Agregar al DOM
  document.body.appendChild(notificacion);

  // Remover después de 5 segundos
  setTimeout(() => {
    notificacion.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 5000);
}

// Función para agregar un nuevo pago
// Función para actualizar el estado de los botones de eliminar
function updateRemoveButtons() {
  const removeButtons = document.querySelectorAll(".btn-remove");
  const shouldDisable = removeButtons.length === 1;

  removeButtons.forEach((button) => {
    button.disabled = shouldDisable;
    if (shouldDisable) {
      button.style.opacity = "0.5";
      button.style.cursor = "not-allowed";
    } else {
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }
  });
}

function addPago() {
  pagoCounter++;
  const pagosList = document.getElementById("pagosList");

  const pagoItem = document.createElement("div");
  pagoItem.className = "pago-item";
  pagoItem.innerHTML = `
        <label>Pago ${pagoCounter}:</label>
        <div class="input-button-container">
            <input required type="number" class="pago-input" step="0.01" placeholder="Ej: 324.12">
            <button type="button" class="btn-remove" onclick="removePago(this)"><i data-lucide="x"></i></button>
        </div>
    `;

  pagosList.appendChild(pagoItem);

  // Actualizar el estado de los botones después de agregar
  updateRemoveButtons();

  // Re-initialize Lucide icons for the new element
  lucide.createIcons();
}

// Función para remover un pago
function removePago(button) {
  // Encontrar el elemento pago-item completo (padre del padre del botón)
  const pagoItem = button.parentElement.parentElement;
  pagoItem.remove();

  // Recontar los pagos
  const pagos = document.querySelectorAll(".pago-item");
  pagos.forEach((pago, index) => {
    const label = pago.querySelector("label");
    label.textContent = `Pago ${index + 1}:`;
  });
  pagoCounter = pagos.length;

  // Actualizar el estado de los botones después de remover
  updateRemoveButtons();
}

// Función para obtener todos los pagos
function getPagos() {
  const pagos = [];
  const pagoInputs = document.querySelectorAll(".pago-input");

  pagoInputs.forEach((input) => {
    const valor = parseFloat(input.value) || 0;
    if (valor > 0) {
      pagos.push(valor);
    }
  });

  return pagos;
}

// Función para validar los datos de entrada
function validarDatos() {
  // Validar que el formulario esté completo
  const form = document.getElementById("calculadoraForm");
  if (!form.checkValidity()) {
    // Mostrar los errores de validación nativos del navegador
    form.reportValidity();
    return false;
  }

  const tipoCambioVenta = parseFloat(
    document.getElementById("tipoCambio").value
  );
  const dolaresOperacion = parseFloat(
    document.getElementById("dolaresVenta").value
  );
  const comisionLLC = parseFloat(
    document.getElementById("comisionPorcentaje").value
  );
  const comisionTuya = parseFloat(
    document.getElementById("gananciaPorcentaje").value
  );
  const pagos = getPagos();

  const errores = [];

  if (!tipoCambioVenta || tipoCambioVenta <= 0) {
    errores.push("El tipo de cambio paralelo debe ser mayor a 0");
  }

  if (!dolaresOperacion || dolaresOperacion <= 0) {
    errores.push("Los dólares adquiridos deben ser mayores a 0");
  }

  if (pagos.length === 0) {
    errores.push("Debe ingresar al menos un pago");
  }

  // Validar que al menos un pago tenga valor
  const pagosConValor = pagos.filter((pago) => pago > 0);
  if (pagosConValor.length === 0) {
    errores.push("Debe ingresar al menos un pago con valor mayor a 0");
  }

  if (comisionLLC < 0 || comisionLLC > 100) {
    errores.push("La comisión LLC debe estar entre 0% y 100%");
  }

  if (comisionTuya < 0 || comisionTuya > 100) {
    errores.push("Tu comisión debe estar entre 0% y 100%");
  }

  if (errores.length > 0) {
    alert("Errores de validación:\n" + errores.join("\n"));
    return false;
  }

  return true;
}

// Función principal de cálculo
function calcularTransaccion(event) {
  // Prevenir el comportamiento por defecto del formulario
  if (event) {
    event.preventDefault();
  }

  if (!validarDatos()) {
    return;
  }

  // Obtener valores de entrada
  const tipoCambioVenta = parseFloat(
    document.getElementById("tipoCambio").value
  ); // Tipo de cambio paralelo (venta)
  const dolaresOperacion = parseFloat(
    document.getElementById("dolaresVenta").value
  );
  const comisionLLC = parseFloat(
    document.getElementById("comisionPorcentaje").value
  );
  const comisionTuya = parseFloat(
    document.getElementById("gananciaPorcentaje").value
  );
  const pagos = getPagos();

  // Cálculos según el modelo de negocio
  const totalInvertido = pagos.reduce((sum, pago) => sum + pago, 0);
  const dolaresComprados = dolaresOperacion; // USD ingresados por el usuario
  const totalVenta = dolaresComprados * tipoCambioVenta; // Bs recibidos por venta al paralelo
  const gananciaBruta = totalVenta - totalInvertido; // Ganancia bruta
  const comisionLLCBs = gananciaBruta * (comisionLLC / 100); // Comisión de la LLC
  const beneficioNeto = gananciaBruta - comisionLLCBs; // Beneficio después de comisión LLC
  const gananciaTuya = beneficioNeto * (comisionTuya / 100); // Tu ganancia
  const gananciaCliente = beneficioNeto - gananciaTuya; // Ganancia del cliente
  const totalReintegroCliente = totalInvertido + gananciaCliente; // Total que recibe el cliente

  // Mostrar resultados
  mostrarResultados({
    totalInvertido,
    dolaresComprados,
    totalVenta,
    tipoCambioVenta,
    gananciaBruta,
    comisionLLCBs,
    beneficioNeto,
    gananciaTuya,
    gananciaCliente,
    totalReintegroCliente,
    comisionLLC,
    comisionTuya,
  });

  // Mostrar sección de resultados
  document.getElementById("resultsSection").style.display = "block";

  // Scroll suave a los resultados
  document.getElementById("resultsSection").scrollIntoView({
    behavior: "smooth",
  });
}

// Función para mostrar los resultados
function mostrarResultados(resultados) {
  // Generar fecha y ID de proforma
  const fecha = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Generar ID único combinando timestamp, random y contador
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const proformaId = "PROF-" + timestamp + "-" + random;

  // Actualizar header de proforma
  document.getElementById("proformaDate").textContent = fecha;
  document.getElementById("proformaId").textContent = `ID: ${proformaId}`;

  // Detalles de la Operación
  document.getElementById("totalInvertido").textContent = formatCurrency(
    resultados.totalInvertido
  );
  document.getElementById(
    "dolaresMostrar"
  ).textContent = `${resultados.dolaresComprados.toFixed(2)} USD`;
  document.getElementById(
    "tipoCambioMostrar"
  ).textContent = `${resultados.tipoCambioVenta.toFixed(2)} Bs/USD`;

  // Resultados para el Cliente
  document.getElementById("valorDolares").textContent = formatCurrency(
    resultados.totalVenta
  );
  document.getElementById("gananciaCliente").textContent = formatCurrency(
    resultados.gananciaCliente
  );

  // Calcular rentabilidad
  const rentabilidad = (
    (resultados.gananciaCliente / resultados.totalInvertido) *
    100
  ).toFixed(2);
  document.getElementById("rentabilidad").textContent = `${rentabilidad}%`;

  // Resumen Final
  document.getElementById("resumenInversion").textContent = formatCurrency(
    resultados.totalInvertido
  );
  document.getElementById("resumenGanancia").textContent = formatCurrency(
    resultados.gananciaCliente
  );
  document.getElementById("resumenRetorno").textContent = formatCurrency(
    resultados.totalReintegroCliente
  );
}

// Función para limpiar todos los campos
function limpiarCampos() {
  document.getElementById("tipoCambio").value = "6.97"; // Tipo de cambio paralelo (venta)
  document.getElementById("dolaresVenta").value = "";
  document.getElementById("comisionPorcentaje").value = "30"; // Comisión LLC
  document.getElementById("gananciaPorcentaje").value = "50"; // Comisión tuya

  // Limpiar pagos
  const pagosList = document.getElementById("pagosList");
  pagosList.innerHTML = `
        <div class="pago-item">
            <label>Pago 1:</label>
            <div class="input-button-container">
                <input required type="number" class="pago-input" step="0.01" placeholder="Ej: 324.12">
                <button type="button" class="btn-remove" onclick="removePago(this)">❌</button>
            </div>
        </div>
    `;
  pagoCounter = 1;

  // Actualizar el estado de los botones después de limpiar
  updateRemoveButtons();

  // Ocultar resultados
  document.getElementById("resultsSection").style.display = "none";
}

// Event listeners para mejor UX
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar el estado de los botones de eliminar
  updateRemoveButtons();

  // Permitir calcular con Enter (ahora manejado por el formulario)
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        // El formulario manejará el envío automáticamente
        e.preventDefault();
        const form = document.getElementById("calculadoraForm");
        if (form) {
          form.dispatchEvent(new Event("submit"));
        }
      }
    });
  });

  // Validación en tiempo real
  const pagoInputs = document.querySelectorAll(".pago-input");
  pagoInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const valor = parseFloat(this.value);
      if (valor < 0) {
        this.value = "";
      }
    });
  });

  // Agregar botones adicionales al HTML
  const inputSection = document.querySelector(".input-section");
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-top: 20px;
        flex-wrap: wrap;
    `;

  buttonContainer.innerHTML = `
        <button type="button" class="btn-clear" onclick="limpiarCampos()" style="
            background: linear-gradient(135deg, #FF4444, #E63939);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
            font-family: 'Inter', sans-serif;
        ">🗑️ Limpiar</button>
    `;

  inputSection.appendChild(buttonContainer);

  // Estilos para los nuevos botones
  const style = document.createElement("style");
  style.textContent = `
        .btn-example:hover, .btn-clear:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }
        .btn-example:hover {
            background: linear-gradient(135deg, #FF8A5C, #E55A2B);
        }
        .btn-clear:hover {
            background: linear-gradient(135deg, #E63939, #D63031);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Obtener precio automáticamente al cargar la página (sin notificaciones la primera vez)
  setTimeout(() => {
    obtenerPrecioDolar(false);
  }, 1000);
});

// Función para compartir mensaje corto por WhatsApp
function compartirWhatsAppCorto() {
  // Crear un resumen de la proforma para compartir
  const proformaData = {
    fecha: document.getElementById("proformaDate").textContent,
    id: document.getElementById("proformaId").textContent,
    inversion: document.getElementById("totalInvertido").textContent,
    dolares: document.getElementById("dolaresMostrar").textContent,
    valorDolares: document.getElementById("valorDolares").textContent,
    ganancia: document.getElementById("gananciaCliente").textContent,
    totalRecibir: document.getElementById("resumenRetorno").textContent,
    rentabilidad: document.getElementById("rentabilidad").textContent,
    tipoCambio: document.getElementById("tipoCambioMostrar").textContent,
  };

  // Mensaje corto para WhatsApp
  const mensaje = `*COTIZACIÓN ESPECIAL*

${proformaData.fecha}
${proformaData.id}

*OPERACIÓN:*
• Inversión: ${proformaData.inversion}
• Dólares: ${proformaData.dolares}
• Ganancia: ${proformaData.ganancia}
• Total: ${proformaData.totalRecibir}
• Rentabilidad: ${proformaData.rentabilidad}

*Sistema de cotizaciones*

(Generado automáticamente)`;

  // Codificar el mensaje para WhatsApp
  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/?text=${mensajeCodificado}`;

  // Abrir WhatsApp en una nueva ventana
  window.open(urlWhatsApp, "_blank");
}

// Función auxiliar para copiar al portapapeles
function copiarAlPortapapeles(texto) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        mostrarNotificacion("Proforma copiada al portapapeles", "success");
      })
      .catch((err) => {
        console.log("Error al copiar:", err);
        fallbackCopyTextToClipboard(texto);
      });
  } else {
    fallbackCopyTextToClipboard(texto);
  }
}

// Fallback para navegadores que no soportan clipboard API
function fallbackCopyTextToClipboard(texto) {
  const textArea = document.createElement("textarea");
  textArea.value = texto;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    mostrarNotificacion("Proforma copiada al portapapeles", "success");
  } catch (err) {
    console.log("Error al copiar:", err);
    mostrarNotificacion("Error al copiar al portapapeles", "error");
  }

  document.body.removeChild(textArea);
}

// Función para copiar al portapapeles el contenido de WhatsApp
function copiarContenidoWhatsApp() {
  // Crear un resumen de la proforma para compartir
  const proformaData = {
    fecha: document.getElementById("proformaDate").textContent,
    id: document.getElementById("proformaId").textContent,
    inversion: document.getElementById("totalInvertido").textContent,
    dolares: document.getElementById("dolaresMostrar").textContent,
    valorDolares: document.getElementById("valorDolares").textContent,
    ganancia: document.getElementById("gananciaCliente").textContent,
    totalRecibir: document.getElementById("resumenRetorno").textContent,
    rentabilidad: document.getElementById("rentabilidad").textContent,
    tipoCambio: document.getElementById("tipoCambioMostrar").textContent,
  };

  // Mensaje corto para WhatsApp (mismo que en compartirWhatsAppCorto)
  const mensaje = `*COTIZACIÓN ESPECIAL*

${proformaData.fecha}
${proformaData.id}

*OPERACIÓN:*
• Inversión: ${proformaData.inversion}
• Dólares: ${proformaData.dolares}
• Ganancia: ${proformaData.ganancia}
• Total: ${proformaData.totalRecibir}
• Rentabilidad: ${proformaData.rentabilidad}

*Sistema de cotizaciones*

(Generado automáticamente)`;

  // Copiar al portapapeles
  copiarAlPortapapeles(mensaje);
}
