import Header from "@/components/header";
import MainContent from "@/components/maincontent";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <MainContent />
      </div>
    </main>
  );
}
