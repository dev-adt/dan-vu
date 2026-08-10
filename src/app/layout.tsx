import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  variable: "--font-playfair",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["vietnamese", "latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Festival Dân Ca Dân Vũ Quốc Tế - Nhịp Bước Việt Nam 2026",
  description: "Nơi tôn vinh bản sắc bản địa và nhịp điệu hiện đại. Cổng thông tin chính thức, đăng ký dự thi, bình chọn trực tuyến và chấm điểm sơ khảo.",
  icons: {
    icon: [
      { url: "/favicon.png?v=3", type: "image/png" },
      { url: "/icon.png?v=3", type: "image/png" },
      { url: "/favicon.ico?v=3" },
    ],
    shortcut: ["/favicon.png?v=3"],
    apple: ["/favicon.png?v=3"],
  },
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=3" />
      </head>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-light-alabaster to-light-cream text-dark-obsidian selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}

