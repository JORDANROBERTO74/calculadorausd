import { NextResponse } from "next/server";

interface BinanceP2PAd {
  adv: {
    price: string;
  };
}

const BINANCE_P2P_URL =
  "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";
const REQUEST_TIMEOUT_MS = 10_000;
const TRIM_PERCENT = 0.2;

function trimmedMean(prices: number[], trimPercent = TRIM_PERCENT): number {
  const sorted = [...prices].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * trimPercent);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  return trimmed.reduce((sum, p) => sum + p, 0) / trimmed.length;
}

export async function POST() {
  try {
    const payload = {
      asset: "USDT",
      fiat: "BOB",
      tradeType: "SELL",
      page: 1,
      rows: 10,
      payTypes: [],
      merchantCheck: true,
      publisherType: "merchant",
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(BINANCE_P2P_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; DolarBlueBot/1.0)",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "No hay anuncios disponibles", success: false },
        { status: 404 },
      );
    }

    const prices: number[] = data.data.map((item: BinanceP2PAd) =>
      parseFloat(item.adv.price),
    );
    const averagePrice = trimmedMean(prices);

    if (isNaN(averagePrice) || averagePrice <= 0) {
      return NextResponse.json(
        { error: "Precio inválido recibido", success: false },
        { status: 400 },
      );
    }

    return NextResponse.json({
      price: averagePrice,
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Timeout: Binance no respondió a tiempo"
        : error instanceof Error
          ? error.message
          : "Error desconocido";

    console.error("Error obteniendo precio P2P:", message);

    return NextResponse.json(
      { error: message, success: false },
      { status: 500 },
    );
  }
}
