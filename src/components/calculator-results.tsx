"use client";

import { useMemo } from "react";
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
import { CalculationResult } from "@/types/calculator";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

function profitColor(value: number) {
  return value >= 0 ? "text-green-600" : "text-red-600";
}

interface CalculatorResultsProps {
  results: CalculationResult;
}

export default function CalculatorResults({ results }: CalculatorResultsProps) {
  const checkoutId = useMemo(
    () => `PROF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    [results]
  );
  const date = useMemo(() => new Date(), [results]);

  const shareWhatsApp = () => {
    const operationLines = [
      results.totalInvested !== 0 && `• Total Invertido: ${results.totalInvested.toFixed(2)} Bs`,
      results.dollarsAcquired !== 0 && `• Dólares Adquiridos: ${results.dollarsAcquired} USD`,
      results.exchangeRate !== 0 && `• Tipo de Cambio: ${results.exchangeRate} Bs/USD`,
    ].filter(Boolean).join("\n");

    const resultLines = [
      results.finalValue !== 0 && `• Valor Final: ${results.finalValue.toFixed(2)} Bs`,
      results.grossProfit !== 0 && results.grossProfit !== results.clientProfit && `• Ganancia Bruta: ${results.grossProfit.toFixed(2)} Bs`,
      results.llcCommissionAmount !== 0 && `• Comisión LLC (${results.llcCommission}%): -${results.llcCommissionAmount.toFixed(2)} Bs`,
      results.withdrawalCommissionAmount !== 0 && `• Comisión de Retiro (${results.withdrawalCommission}%): -${results.withdrawalCommissionAmount.toFixed(2)} Bs`,
      results.clientProfit !== 0 && `• Ganancia Final: *${results.clientProfit.toFixed(2)} Bs*`,
      results.profitability !== 0 && `• Rentabilidad: *${results.profitability.toFixed(2)}%*`,
    ].filter(Boolean).join("\n");

    const summaryLines = [
      results.totalReturn !== 0 && `• Reintegro Total: *${results.totalReturn.toFixed(2)} Bs*`,
    ].filter(Boolean).join("\n");

    const sections = [
      `*COTIZACIÓN DETALLADA*\n\n${formatDateTime(date)}\nID: ${checkoutId}`,
      operationLines && `*Detalles de la Operación:*\n${operationLines}`,
      resultLines && `*Resultados:*\n${resultLines}`,
      summaryLines && `*Resumen:*\n${summaryLines}`,
      `_Calculado con la Calculadora de Transacciones Comerciales_`,
    ].filter(Boolean).join("\n\n");

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(sections)}`;
    window.open(whatsappUrl, "_blank");
  };

  const copyContent = () => {
    const operationLines = [
      results.totalInvested !== 0 && `• Total Invertido: ${results.totalInvested.toFixed(2)} Bs`,
      results.dollarsAcquired !== 0 && `• Dólares Adquiridos: ${results.dollarsAcquired} USD`,
      results.exchangeRate !== 0 && `• Tipo de Cambio: ${results.exchangeRate} Bs/USD`,
    ].filter(Boolean).join("\n");

    const resultLines = [
      results.finalValue !== 0 && `• Valor Final: ${results.finalValue.toFixed(2)} Bs`,
      results.grossProfit !== 0 && results.grossProfit !== results.clientProfit && `• Ganancia Bruta: ${results.grossProfit.toFixed(2)} Bs`,
      results.llcCommissionAmount !== 0 && `• Comisión LLC (${results.llcCommission}%): -${results.llcCommissionAmount.toFixed(2)} Bs`,
      results.withdrawalCommissionAmount !== 0 && `• Comisión de Retiro (${results.withdrawalCommission}%): -${results.withdrawalCommissionAmount.toFixed(2)} Bs`,
      results.clientProfit !== 0 && `• Ganancia Final: ${results.clientProfit.toFixed(2)} Bs`,
      results.profitability !== 0 && `• Rentabilidad: ${results.profitability.toFixed(2)}%`,
    ].filter(Boolean).join("\n");

    const summaryLines = [
      results.totalReturn !== 0 && `• Reintegro Total: ${results.totalReturn.toFixed(2)} Bs`,
    ].filter(Boolean).join("\n");

    const sections = [
      `COTIZACIÓN DETALLADA\n\n${formatDateTime(date)}\nID: ${checkoutId}`,
      operationLines && `Detalles de la Operación:\n${operationLines}`,
      resultLines && `Resultados:\n${resultLines}`,
      summaryLines && `Resumen:\n${summaryLines}`,
      `Calculado con la Calculadora de Transacciones Comerciales`,
    ].filter(Boolean).join("\n\n");

    navigator.clipboard.writeText(sections);
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
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{formatDate(date)}</span>
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
            {results.totalInvested !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Invertido:</span>
                <span className="font-medium">
                  {results.totalInvested.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.dollarsAcquired !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dólares Adquiridos:</span>
                <span className="font-medium">{results.dollarsAcquired} USD</span>
              </div>
            )}
            {results.exchangeRate !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo de Cambio:</span>
                <span className="font-medium">{results.exchangeRate} Bs/USD</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Operation Results */}
        <Accordion type="single" collapsible defaultValue="operation-results" className="w-full">
          <AccordionItem value="operation-results" className="border-none">
            <AccordionTrigger className="hover:no-underline">
              <h3 className="font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Resultados de la Operación
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pt-4">
                {results.finalValue !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Valor Final en Bs:
                    </span>
                    <span className="font-medium">
                      {results.finalValue.toFixed(2)} Bs
                    </span>
                  </div>
                )}
                {results.grossProfit !== 0 && results.grossProfit !== results.clientProfit && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ganancia Bruta:</span>
                    <Badge variant="secondary" className={profitColor(results.grossProfit)}>
                      {results.grossProfit.toFixed(2)} Bs
                    </Badge>
                  </div>
                )}
                {results.llcCommissionAmount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Comisión LLC ({results.llcCommission}%):
                    </span>
                    <Badge variant="outline" className="text-red-600">
                      -{results.llcCommissionAmount.toFixed(2)} Bs
                    </Badge>
                  </div>
                )}
                {results.llcCommission !== 0 && results.remainingAfterLLC !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Restante después LLC:
                    </span>
                    <span className="font-medium">
                      {results.remainingAfterLLC.toFixed(2)} Bs
                    </span>
                  </div>
                )}
                {results.withdrawalCommissionAmount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Comisión de Retiro ({results.withdrawalCommission}%):
                    </span>
                    <Badge variant="outline" className="text-orange-600">
                      -{results.withdrawalCommissionAmount.toFixed(2)} Bs
                    </Badge>
                  </div>
                )}
                {results.clientProfit !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ganancia Final:</span>
                    <Badge variant="secondary" className={profitColor(results.clientProfit)}>
                      {results.clientProfit.toFixed(2)} Bs
                    </Badge>
                  </div>
                )}
                {results.profitability !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rentabilidad:</span>
                    <Badge variant="outline" className={profitColor(results.profitability)}>
                      {results.profitability.toFixed(2)}%
                    </Badge>
                  </div>
                )}
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
            {results.totalInvested !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Inversión Inicial:</span>
                <span className="font-medium">
                  {results.totalInvested.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.grossProfit !== 0 && results.grossProfit !== results.clientProfit && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ganancia Bruta:</span>
                <span className={`font-medium ${profitColor(results.grossProfit)}`}>
                  {results.grossProfit.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.llcCommissionAmount !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Comisión LLC:</span>
                <span className="font-medium text-red-600">
                  -{results.llcCommissionAmount.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.withdrawalCommissionAmount !== 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Comisión de Retiro:</span>
                <span className="font-medium text-orange-600">
                  -{results.withdrawalCommissionAmount.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.clientProfit !== 0 && (
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Ganancia Final:</span>
                <span className={`font-bold text-lg ${profitColor(results.clientProfit)}`}>
                  {results.clientProfit.toFixed(2)} Bs
                </span>
              </div>
            )}
            {results.totalReturn !== 0 && (
              <div className="flex justify-between border-t pt-2">
                <span className="font-semibold">Reintegro Total:</span>
                <span className={`font-bold text-lg ${profitColor(results.totalReturn - results.totalInvested)}`}>
                  {results.totalReturn.toFixed(2)} Bs
                </span>
              </div>
            )}
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
