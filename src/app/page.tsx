import Header from "@/components/header";
import MainContent from "@/components/maincontent";
import Sidebar from "@/components/sidebar";
import { ChatProvider } from "@/context/chatContext";

export default function Home() {
  return (
    <main className="max-h-screen absolute w-full">
      <ChatProvider>
        <Header />
        <div className="flex h-screen">
          <Sidebar />
          <MainContent />
        </div>
      </ChatProvider>
    </main>
  );
}
