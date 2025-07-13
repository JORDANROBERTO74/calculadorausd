"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Smartphone,
  Copy,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import moment from "moment";

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
  extraExpenses: number;
  clientProfit: number;
  profitability: number;
  totalReturn: number;
}

interface CalculatorResultsProps {
  results: CalculationResult;
}

export default function CalculatorResults({ results }: CalculatorResultsProps) {
  const checkoutId = `PROF-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
  const date = new Date();

  const shareWhatsApp = () => {
    const message = `*COTIZACIÓN DETALLADA*

${moment(date).format("DD/MM/YYYY HH:mm a")}
ID: ${checkoutId}

*Detalles de la Operación:*
• Total Invertido: ${results.totalInvested.toFixed(2)} Bs
• Dólares Adquiridos: ${results.dollarsAcquired} USD
• Tipo de Cambio: ${results.exchangeRate} Bs/USD

*Resultados:*
• Valor Final: ${results.finalValue.toFixed(2)} Bs
• Ganancia Bruta: ${results.grossProfit.toFixed(2)} Bs
• Comisión LLC (${
      results.llcCommission
    }%): -${results.llcCommissionAmount.toFixed(2)} Bs
• Gastos Extra: -${results.extraExpenses.toFixed(2)} Bs
• Comisión de Retiro (${
      results.withdrawalCommission
    }%): -${results.withdrawalCommissionAmount.toFixed(2)} Bs
• Ganancia Final: *${results.clientProfit.toFixed(2)} Bs*
• Rentabilidad: *${results.profitability.toFixed(2)}%*

*Resumen:*
• Reintegro Total: *${results.totalReturn.toFixed(2)} Bs*

_Calculado con la Calculadora de Transacciones Comerciales_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyContent = () => {
    const content = `COTIZACIÓN DETALLADA

${moment(date).format("DD/MM/YYYY HH:mm a")}
ID: ${checkoutId}

Detalles de la Operación:
• Total Invertido: ${results.totalInvested.toFixed(2)} Bs
• Dólares Adquiridos: ${results.dollarsAcquired} USD
• Tipo de Cambio: ${results.exchangeRate} Bs/USD

Resultados:
• Valor Final: ${results.finalValue.toFixed(2)} Bs
• Ganancia Bruta: ${results.grossProfit.toFixed(2)} Bs
• Comisión LLC (${
      results.llcCommission
    }%): -${results.llcCommissionAmount.toFixed(2)} Bs
• Gastos Extra: -${results.extraExpenses.toFixed(2)} Bs
• Comisión de Retiro (${
      results.withdrawalCommission
    }%): -${results.withdrawalCommissionAmount.toFixed(2)} Bs
• Ganancia Final: ${results.clientProfit.toFixed(2)} Bs
• Rentabilidad: ${results.profitability.toFixed(2)}%

Resumen:
• Reintegro Total: ${results.totalReturn.toFixed(2)} Bs

Calculado con la Calculadora de Transacciones Comerciales`;

    navigator.clipboard.writeText(content);
    toast({
      title: "Contenido copiado",
      description: "La cotización ha sido copiada al portapapeles",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          COTIZACIÓN DE TRANSACCIÓN
        </CardTitle>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{moment(date).format("DD/MM/YYYY")}</span>
          <span>ID: {checkoutId}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Operation Details */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Detalles de la Operación
          </h3>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Invertido:</span>
              <span className="font-medium">
                {results.totalInvested.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dólares Adquiridos:</span>
              <span className="font-medium">{results.dollarsAcquired} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tipo de Cambio:</span>
              <span className="font-medium">{results.exchangeRate} Bs/USD</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Operation Results */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="operation-results" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resultados de la Operación
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Valor Final en Bs:
                  </span>
                  <span className="font-medium">
                    {results.finalValue.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ganancia Bruta:</span>
                  <Badge variant="secondary" className="text-green-600">
                    {results.grossProfit.toFixed(2)} Bs
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Comisión LLC ({results.llcCommission}%):
                  </span>
                  <Badge variant="outline" className="text-red-600">
                    -{results.llcCommissionAmount.toFixed(2)} Bs
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Restante después LLC:
                  </span>
                  <span className="font-medium">
                    {results.remainingAfterLLC.toFixed(2)} Bs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gastos Extra:</span>
                  <Badge variant="outline" className="text-red-600">
                    -{results.extraExpenses.toFixed(2)} Bs
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Restante después G. E.:
                  </span>
                  <span className="font-medium">
                    {(
                      results.remainingAfterLLC - results.extraExpenses
                    ).toFixed(2)}
                    Bs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Comisión de Retiro ({results.withdrawalCommission}%):
                  </span>
                  <Badge variant="outline" className="text-orange-600">
                    -{results.withdrawalCommissionAmount.toFixed(2)} Bs
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ganancia Final:</span>
                  <Badge variant="secondary" className="text-blue-600">
                    {results.clientProfit.toFixed(2)} Bs
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rentabilidad:</span>
                  <Badge variant="outline" className="text-purple-600">
                    {results.profitability.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        {/* Final Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Resumen Final
          </h3>
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Inversión Inicial:</span>
              <span className="font-medium">
                {results.totalInvested.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ganancia Bruta:</span>
              <span className="font-medium">
                {results.grossProfit.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comisión LLC:</span>
              <span className="font-medium text-red-600">
                -{results.llcCommissionAmount.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comisión de Retiro:</span>
              <span className="font-medium text-orange-600">
                -{results.withdrawalCommissionAmount.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Ganancia Final:</span>
              <span className="font-bold text-lg text-blue-600">
                {results.clientProfit.toFixed(2)} Bs
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Reintegro Total:</span>
              <span className="font-bold text-lg text-green-600">
                {results.totalReturn.toFixed(2)} Bs
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-2 pt-4">
          <Button onClick={shareWhatsApp} className="flex-1">
            <Smartphone className="h-4 w-4 mr-2" />
            Compartir en WhatsApp
          </Button>
          <Button onClick={copyContent} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copiar contenido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
