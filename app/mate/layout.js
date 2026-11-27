// Keeps the dates page (/mate) out of search engines.
export const metadata = { title: "Mithun's Soulmate: the dates", robots: { index: false, follow: false } };

export default function AdminLayout({ children }) {
  return children;
}
