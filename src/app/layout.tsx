import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniPlan - Plateforme de Gestion Universitaire & Emplois du Temps",
  description: "Solution SaaS académique pour les instituts et universités : planification sans conflit, gestion des vœux enseignants, affectation des salles et suivi des absences.",
};

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      var isDark = savedTheme ? savedTheme === 'dark' : true;
      var root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      var savedLang = localStorage.getItem('preferred_lang');
      if (savedLang) {
        root.setAttribute('lang', savedLang);
      }
      root.classList.add('page-ready');
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="antialiased min-h-screen bg-primary text-secondary">
        {children}
      </body>
    </html>
  );
}
