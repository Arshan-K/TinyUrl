import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 sm:px-6 py-6 max-w-6xl w-full mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}
