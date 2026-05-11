import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOpsGuru — DevOps Coaching · Yerevan, Armenia",
  description: "From zero to production-ready DevOps engineer. Live coaching, hands-on labs, and real-world projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
