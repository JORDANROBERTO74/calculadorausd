"use client";

import { useState } from "react";
import CalculatorInput from "./calculator-input";
import CalculatorResults from "./calculator-results";

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

export default function Calculator() {
  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleCalculate = (calculationResults: CalculationResult) => {
    setResults(calculationResults);
  };

  return (
    <div className="py-10 relative z-10 flex items-center justify-center w-100vw md:w-full">
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* Input Section */}
        <CalculatorInput onCalculate={handleCalculate} />

        {/* Results Section */}
        {results && <CalculatorResults results={results} />}
      </div>
    </div>
  );
}
