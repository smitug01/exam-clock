import "./globals.css";
import { Noto_Sans_TC } from "next/font/google";

const inter = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});
export const runtime = "edge";

export const metadata = {
  title: "考試時程表",
  description: "@smitug01 on GitHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <style>
        {`
        /* width */
        ::-webkit-scrollbar {
          width: 2px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          opacity: 0;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
          opacity: 0; 
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          opacity: 0; 
        }
      `}
      </style>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
