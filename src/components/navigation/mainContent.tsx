export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full max-w-screen flex relative">
      {/* Background decorative elements */}
      <div className="hidden md:block absolute inset-0 w-full max-w-screen">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-2xl"></div>
      </div>

      {children}
    </main>
  );
}
