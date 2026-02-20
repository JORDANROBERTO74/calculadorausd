"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CalculatorInput from "./calculator-input";
import CalculatorResults from "./calculator-results";
import { CalculationResult } from "@/types/calculator";

export default function Calculator() {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (calculationResults: CalculationResult) => {
    setResults(calculationResults);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="py-10 relative z-10 flex items-center justify-center w-screen md:w-full">
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
        <CalculatorInput onCalculate={handleCalculate} onReset={handleReset} />

        <AnimatePresence>
          {results && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CalculatorResults results={results} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
