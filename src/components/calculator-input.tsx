"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calculator as CalculatorIcon,
  DollarSign,
  Plus,
  X,
  BarChart3,
  CreditCard,
  RotateCcw,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useP2PPrice } from "@/hooks/useP2PPrice";
import { Spinner } from "@/components/ui/spinner";
import { CalculationResult } from "@/types/calculator";

interface Payment {
  id: string;
  amount: number;
}

interface CalculatorInputProps {
  onCalculate: (result: CalculationResult) => void;
  onReset: () => void;
}

export default function CalculatorInput({ onCalculate, onReset }: CalculatorInputProps) {
  const [payments, setPayments] = useState<Payment[]>([{ id: "1", amount: 0 }]);
  const [dollarsAcquired, setDollarsAcquired] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(6.97);
  const [llcCommission, setLlcCommission] = useState<number>(0);
  const [userCommission, setUserCommission] = useState<number>(100);
  const { getP2PPrice, isLoading } = useP2PPrice();
  const paymentCounter = useRef(1);

  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    handleGetP2PPrice(false);
  }, []);

  const addPayment = () => {
    paymentCounter.current += 1;
    setPayments([...payments, { id: paymentCounter.current.toString(), amount: 0 }]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(payments.filter((payment) => payment.id !== id));
    }
  };

  const updatePayment = (id: string, amount: number) => {
    setPayments(
      payments.map((payment) =>
        payment.id === id ? { ...payment, amount } : payment
      )
    );
  };

  const handleGetP2PPrice = async (showToast: boolean = true) => {
    const result = await getP2PPrice();
    if (result.success) {
      setExchangeRate(Number(result.price.toFixed(2)));
      if (showToast) {
        toast({
          title: "Precio P2P obtenido",
          description: `Tipo de cambio: ${result.price.toFixed(2)} Bs/USDT`,
        });
      }
    } else {
      if (showToast) {
        toast({
          title: "Error",
          description: `No se pudo obtener el precio P2P de Binance: ${result.error}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleReset = () => {
    setPayments([{ id: "1", amount: 0 }]);
    paymentCounter.current = 1;
    setDollarsAcquired(0);
    setExchangeRate(6.97);
    setLlcCommission(0);
    setUserCommission(100);
    onReset();
    handleGetP2PPrice(false);
  };

  const calculateTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    const totalInvested = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (totalInvested <= 0 || dollarsAcquired <= 0 || exchangeRate <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive",
      });
      return;
    }

    const finalValue = dollarsAcquired * exchangeRate;
    const grossProfit = finalValue - totalInvested;

    const llcCommissionAmount = grossProfit * (llcCommission / 100);
    const remainingAfterLLC = grossProfit - llcCommissionAmount;

    const withdrawalCommission = 100 - userCommission;
    const withdrawalCommissionAmount =
      remainingAfterLLC * (withdrawalCommission / 100);

    const clientProfit = remainingAfterLLC - withdrawalCommissionAmount;

    const profitability = (clientProfit / totalInvested) * 100;
    const totalReturn = totalInvested + clientProfit;

    const result: CalculationResult = {
      totalInvested,
      dollarsAcquired,
      exchangeRate,
      finalValue,
      grossProfit,
      llcCommission,
      llcCommissionAmount,
      remainingAfterLLC,
      withdrawalCommission,
      withdrawalCommissionAmount,
      clientProfit,
      profitability,
      totalReturn,
    };

    onCalculate(result);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Datos de Entrada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={calculateTransaction} className="space-y-6">
          {/* Payments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <Label className="text-sm font-medium">
                Pagos Realizados (Bs):
              </Label>
            </div>

            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex gap-2">
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 165.85"
                    value={payment.amount || ""}
                    onChange={(e) =>
                      updatePayment(payment.id, parseFloat(e.target.value) || 0)
                    }
                    className="flex-1"
                  />
                  {payments.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removePayment(payment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {totalPayments > 0 && (
              <p className="text-sm text-muted-foreground text-right font-medium">
                Total: {totalPayments.toFixed(2)} Bs
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={addPayment}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pago
            </Button>
          </div>

          <Separator />

          {/* Dollars Acquired */}
          <div className="space-y-2">
            <Label htmlFor="dollarsAcquired">Dólares adquiridos (USD):</Label>
            <Input
              required
              id="dollarsAcquired"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 23"
              value={dollarsAcquired || ""}
              onChange={(e) =>
                setDollarsAcquired(parseFloat(e.target.value) || 0)
              }
            />
          </div>

          {/* Exchange Rate */}
          <div className="space-y-2">
            <Label htmlFor="exchangeRate">
              Tipo de Cambio Paralelo (Venta):
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                required
                id="exchangeRate"
                type="number"
                min="0"
                step="0.01"
                value={exchangeRate || ""}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                placeholder="Ej: 6.97"
              />
              <Button
                type="button"
                onClick={() => handleGetP2PPrice(true)}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shrink-0"
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Precio P2P
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Obtiene el precio promedio de venta USDT/BOB en Binance P2P
            </p>
          </div>

          {/* Commissions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="llcCommission">Comisión LLC (%):</Label>
              <Input
                required
                id="llcCommission"
                type="number"
                min="0"
                max="100"
                value={llcCommission}
                placeholder="Ej: 30"
                onChange={(e) => setLlcCommission(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCommission" className="inline-flex items-center gap-1">
                Tu Ganancia (%)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Porcentaje de la ganancia restante que te corresponde</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                required
                id="userCommission"
                type="number"
                min="0"
                max="100"
                value={userCommission}
                placeholder="Ej: 50"
                onChange={(e) => setUserCommission(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Calcular Transacción
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
