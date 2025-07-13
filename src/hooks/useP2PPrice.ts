import { useState } from "react";

interface P2PPriceResponse {
  price: number;
  success: boolean;
  error?: string;
}

export const useP2PPrice = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getP2PPrice = async (): Promise<P2PPriceResponse> => {
    setIsLoading(true);

    try {
      // Llamar a nuestra API route que maneja la petición a Binance
      const response = await fetch("/api/p2p-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Error desconocido");
      }

      return {
        price: data.price,
        success: true,
      };
    } catch (error) {
      console.error("Error obteniendo precio P2P:", error);
      return {
        price: 0,
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getP2PPrice,
    isLoading,
  };
};
