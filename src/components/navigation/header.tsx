"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="relative text-center pt-8">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        Calculadora de Transacciones
      </h1>
      <p className="text-muted-foreground text-sm md:text-base mx-4">
        Calcula ganancias, comisiones y reintegros de tus ventas
      </p>
    </div>
  );
}
