import Header from "../components/layout/Header";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#EFFDF0]">
      <Header />
      <Hero />
    </div>
  );
}
