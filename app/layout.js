import "./globals.css";

export const metadata = {
  title: "Mithun's Soulmate",
  description: "The cutest dating site on the internet. Members: one, in Coimbatore (CBE). Applications close at midnight.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Great+Vibes&family=Pacifico&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
