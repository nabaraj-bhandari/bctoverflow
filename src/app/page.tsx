import HomePage from "@/components/HomePage";
import NavBar from "@/components/NavBar";

export default function Home() {
  const hasNewNotices = true;
  return (
    <div className="min-h-screen bg-app">
      <NavBar hasNewNotices={hasNewNotices} />
      <HomePage />
    </div>
  );
}
