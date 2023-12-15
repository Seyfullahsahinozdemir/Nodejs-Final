import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-full"> {children} </main>;
}
