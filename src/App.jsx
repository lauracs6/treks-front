import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Treks from "./pages/Treks";
import TrekDetail from "./pages/TrekDetail";

export default function App() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("http://baleartrek.test/api/treks");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: error loading treks`);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        setTreks(data.data);
      } catch (fetchError) {
        console.error("Error fetching treks:", fetchError);
        setError(fetchError.message || "Error loading treks");
      } finally {
        setLoading(false);
      }
    };

    fetchTreks();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing treks={treks} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/treks"
            element={<Treks treks={treks} loading={loading} error={error} />}
          />
          <Route path="/treks/:regNumber" element={<TrekDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
