export default function Footer() {
  return (
    <footer className="text-center py-2 text-white bg-muted-foreground">
      <p className="text-xs md:text-base">
        &copy; {new Date().getFullYear()} Calculadora de Transacciones Comerciales
      </p>
    </footer>
  );
}
