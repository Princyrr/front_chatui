import "./globals.css";


export const metadata = {
  title: "Agente de IA",
  description: "Chat com agente inteligente Next + Nest + MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
