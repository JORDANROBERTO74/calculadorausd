import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // URL de la API pública de Binance P2P
    const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

    // Headers requeridos
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; DolarBlueBot/1.0)",
    };

    // Parámetros de búsqueda para obtener precio de venta de USDT en BOB
    const payload = {
      asset: "USDT", // Criptomoneda
      fiat: "BOB", // Moneda local (Bolivianos)
      tradeType: "SELL", // Tipo de operación (venta de USDT)
      page: 1,
      rows: 20,
      payTypes: [],
      publisherType: null,
    };

    // Realizar petición POST desde el servidor
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Verificar que hay datos disponibles
    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "No hay anuncios disponibles" },
        { status: 404 }
      );
    }

    const prices = data.data.map((item: any) => item.adv.price);
    // Calcular el promedio de los precios
    const averagePrice =
      prices.reduce(
        (sum: number, price: string) => sum + parseFloat(price),
        0
      ) / prices.length;

    // Extraer precio del primer anuncio (mejor precio)
    const referencePrice = averagePrice;

    if (isNaN(referencePrice) || referencePrice <= 0) {
      return NextResponse.json(
        { error: "Precio inválido recibido" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      price: referencePrice,
      success: true,
    });
  } catch (error) {
    console.error("Error obteniendo precio P2P:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido",
        success: false,
      },
      { status: 500 }
    );
  }
}
