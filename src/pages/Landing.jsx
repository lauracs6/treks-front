// src/pages/Landing.jsx
import { useMemo } from "react";
import { getTrekDescription } from "../data/trekDescriptions";
import TestimonyCard from "../components/TestimonyCard";
import TrekCard from "../components/TrekCard";
import testimonialsData from "../data/testimonialsData.json";

const BASE_URL = "http://baleartrek.test";

export default function Landing({ treks = [], trekImages = [] }) {
  console.log("Landing treks data:", treks);
  // Función para normalizar datos dentro del componente
  const normalizeTrekData = (trek, index) => {
    const municipality = trek.municipality?.name || "";
    const island = trek.municipality?.island?.name || "";
    const rating = trek.score?.average || null;
    const regNumber = trek.registre || trek.regNumber || `T${trek.id}`;
    const nom = trek.nom || trek.name || `Trek ${index + 1}`;
    const description = getTrekDescription(regNumber);

    return {
      id: trek.id || `trek-${index}`,
      regNumber: regNumber,
      nom: nom,
      description: description,
      rating: rating,
      image: trek.imageUrl
        ? `${BASE_URL}/${trek.imageUrl}`
        : trekImages[index % trekImages.length] ||
          "https://via.placeholder.com/400x300?text=Trek+Image",
      imageAlt: `View of ${nom}`,
      municipality: municipality,
      island: island,
    };
  };

  // Normaliza los treks
  const normalizedTreks = useMemo(() => {
    if (!treks || !treks.length) return [];
    return treks.map((trek, index) => normalizeTrekData(trek, index));
  }, [treks, trekImages]);

  // Selecciona los 3 mejores treks basados en el rating
  const topRatedTreks = useMemo(() => {
    return [...normalizedTreks]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [normalizedTreks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 md:px-8 border-b border-gray-300">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            WELCOME TO BALEARTREK
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Discover the most beautiful hiking routes in the Balearic Islands
          </p>
        </div>
      </header>

      {/* Main con sidebar y grid */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="border border-gray-300 p-6 bg-white shadow-m">
              <h3 className="text-xl font-bold text-black mb-2">
                For Your Hike
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                Essential information for your trekking adventure
              </p>

              {/* Cita famosa */}
              <div className="mb-8 pb-6 border-b border-gray-300">
                <h4 className="text-lg font-semibold text-black mb-3">
                  About Mallorca
                </h4>
                <div className="bg-sky-300 p-4 rounded-lg">
                  <p className="text-gray-700 italic">
                    "Mallorca is not just an island, it's a state of mind, a way
                    of living."
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    — Camilo José Cela
                  </p>
                </div>
              </div>

              {/* Recomendaciones */}
              <div>
                <h4 className="text-lg font-semibold text-black mb-3">
                  Basic Gear
                </h4>
                <div className="space-y-2">
                  {[
                    "Comfortable backpack",
                    "Water (1.5L minimum)",
                    "Fruit or energy snacks",
                    "Hat or cap",
                    "Light rain jacket",
                    "Fully charged phone",
                    "Sunscreen",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-100 rounded-md hover:bg-sky-100 transition-colors"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:w-3/4">
            {/* Grid header */}
            <div className="mb-8 pb-4 border-b border-gray-300">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Top Rated Treks
              </h2>
              <p className="text-gray-700 mt-2">
                Discover our most highly rated hiking routes
              </p>
            </div>

            {/* Grid de trek cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedTreks.length > 0 ? (
                topRatedTreks.map((trek) => (
                  <TrekCard key={trek.id} trek={trek} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600">
                    No treks available at the moment.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Testimonials */}
      <section className="bg-gray-100 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10">
            What our hikers say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialsData.map((testimonial, index) => (
              <TestimonyCard
                key={index}
                image={testimonial.image}
                name={testimonial.name}
                text={testimonial.text}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
