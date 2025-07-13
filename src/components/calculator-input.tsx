"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Calculator as CalculatorIcon,
  DollarSign,
  Plus,
  X,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useP2PPrice } from "@/hooks/useP2PPrice";
import { Spinner } from "@/components/ui/spinner";

interface Payment {
  id: string;
  amount: number;
}

interface CalculationResult {
  totalInvested: number;
  dollarsAcquired: number;
  exchangeRate: number;
  finalValue: number;
  grossProfit: number;
  llcCommission: number;
  llcCommissionAmount: number;
  remainingAfterLLC: number;
  withdrawalCommission: number;
  withdrawalCommissionAmount: number;
  clientProfit: number;
  extraExpenses: number;
  profitability: number;
  totalReturn: number;
}

interface CalculatorInputProps {
  onCalculate: any;
}

export default function CalculatorInput({ onCalculate }: CalculatorInputProps) {
  const [payments, setPayments] = useState<Payment[]>([{ id: "1", amount: 0 }]);
  const [dollarsAcquired, setDollarsAcquired] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(6.97);
  const [llcCommission, setLlcCommission] = useState<number>(30);
  const [userCommission, setUserCommission] = useState<number>(50);
  const [extraExpenses, setExtraExpenses] = useState<number>(0);
  const [showExtraExpenses, setShowExtraExpenses] = useState<boolean>(false);
  const { getP2PPrice, isLoading } = useP2PPrice();

  // Ejecutar automáticamente al cargar la página
  useEffect(() => {
    handleGetP2PPrice(false);
  }, []);

  const addPayment = () => {
    const newId = (payments.length + 1).toString();
    setPayments([...payments, { id: newId, amount: 0 }]);
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

  const scrollToResults = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
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

    // Aplicar comisión LLC (30% por defecto)
    const llcCommissionAmount = grossProfit * (llcCommission / 100);
    const remainingAfterLLC = grossProfit - llcCommissionAmount;
    const remainingAfterExtraExpenses = remainingAfterLLC - extraExpenses;

    // Aplicar comisión de retiro (50% por defecto del restante)
    const withdrawalCommission = 100 - userCommission;
    const withdrawalCommissionAmount =
      remainingAfterExtraExpenses * (withdrawalCommission / 100);

    const clientProfit =
      remainingAfterExtraExpenses - withdrawalCommissionAmount;

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
      extraExpenses,
      clientProfit,
      profitability,
      totalReturn,
    };

    onCalculate(result);

    scrollToResults();
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
            <div className="flex gap-2">
              <Input
                required
                id="exchangeRate"
                type="number"
                step="any"
                value={exchangeRate || ""}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                placeholder="Ej: 6.97"
              />
              <Button
                type="button"
                onClick={() => handleGetP2PPrice(true)}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-[220px]"
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
            <p className="text-xs text-gray-500">
              💡 Obtiene precios reales de Binance P2P y AirTM
            </p>
          </div>

          {/* Commissions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="llcCommission">Comisión LLC (%):</Label>
              <Input
                required
                readOnly
                id="llcCommission"
                type="number"
                value={llcCommission}
                placeholder="Ej: 30"
                onChange={(e) => setLlcCommission(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userCommission">Tu Comisión (%):</Label>
              <Input
                required
                id="userCommission"
                type="number"
                value={userCommission}
                placeholder="Ej: 50"
                onChange={(e) => setUserCommission(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Extra expenses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="extraExpenses">Gastos extra (Bs):</Label>
              <Switch
                id="extraExpensesSwitch"
                checked={showExtraExpenses}
                onCheckedChange={() => {
                  setShowExtraExpenses(!showExtraExpenses);
                  setExtraExpenses(0);
                }}
              />
            </div>
            {showExtraExpenses && (
              <Input
                required={showExtraExpenses}
                id="extraExpenses"
                type="number"
                value={extraExpenses || ""}
                placeholder="Ej: 20"
                onChange={(e) => setExtraExpenses(parseFloat(e.target.value))}
              />
            )}
          </div>

          <Button type="submit" className="w-full">
            <CalculatorIcon className="h-4 w-4 mr-2" />
            Calcular Transacción
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
