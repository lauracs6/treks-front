import faqData from "../data/faqData.json";
import { useEffect, useState } from "react";

export default function About({ trekImages = [] }) {
  const [faqItems, setFaqItems] = useState([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Carrusel automático
  useEffect(() => {
    if (trekImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentCarouselIndex((prevIndex) =>
        prevIndex === trekImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [trekImages.length]);

  const nextImage = () => {
    if (trekImages.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === trekImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    if (trekImages.length === 0) return;
    setCurrentCarouselIndex((prevIndex) =>
      prevIndex === 0 ? trekImages.length - 1 : prevIndex - 1,
    );
  };

  // Inicializar FAQ
  useEffect(() => {
    setFaqItems(faqData);
  }, []);

  // Función para formatear texto con saltos de línea, listas y negritas
  const formatText = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.trim().startsWith("•")) {
        return (
          <div key={index} className="flex items-start mb-1">
            <span className="mr-2">•</span>
            <span>{line.substring(1).trim()}</span>
          </div>
        );
      } else if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <span key={i} className="font-bold">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
          </p>
        );
      } else {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 md:px-8 border-b border-gray-300">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            About Baleartrek - FAQ
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Learn more about our mission and how the platform works
          </p>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-9">
          {/* Sidebar */}
          <aside className="lg:w-1/4 flex flex-col">
            <div className="bg-white shadow-sm p-6 flex-1 border border-gray-300">
              <h3 className="text-xl font-bold text-black mb-2">
                Brief History of the Balearic Islands
              </h3>
              <br></br>
              <div className="mb-8 pb-6">
                {/* Imagen del archipiélago */}
                <div className="mb-4">
                  <img
                    src="./images/islands-map.png"
                    alt="Balearic Islands Map"
                    className="w-56 h-44 object-cover border border-gray-300 mx-auto"
                  />
                  <p className="text-xs text-black mt-1 text-center">
                    The Balearic Archipelago
                  </p>
                </div>

                <p className="text-black text-m mb-4">
                  The Balearic Islands have a rich history dating back to
                  prehistoric times. The <b>Talayotic culture</b> left
                  impressive megalithic monuments across the islands.
                </p>
                <br></br>

                {/* Imagen de Jaime I */}
                <div className="mb-4">
                  <img
                    src="./images/jaime-i.jpg"
                    alt="King James I of Aragon"
                    className="w-56 h-44 object-cover border border-gray-300 mx-auto"
                  />
                  <p className="text-xs text-black mt-1 text-center">
                    King James I "The Conqueror"
                  </p>
                </div>

                <p className="text-black text-m mb-4">
                  In 1229, <b>King James I of Aragon</b> conquered Mallorca from
                  the Moors, beginning the Catalan-Aragonese rule that shaped
                  the islands' culture and language.
                </p>
                <br></br>

                {/* Bandera de las Islas Baleares */}
                <div className="mb-4">
                  <img
                    src="./images/baleares-bandera.jpg"
                    alt="Flag of Balearic Islands"
                    className="w-56 h-44 object-cover border border-gray-300 mx-auto"
                  />
                  <p className="text-xs text-black mt-1 text-center">
                    The flag of the islands
                  </p>
                </div>

                <p className="text-black text-m">
                  Today, the islands are an autonomous community of Spain, known
                  worldwide for their natural beauty, beaches, and unique
                  Mediterranean culture.
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:w-3/4 flex flex-col">
            {/* CONTENIDO COMBINADO - Our Story + Carousel en mismo contenedor */}
            <div className="bg-white border border-gray-300 shadow-sm flex-1">
              {/* Sección Our Story */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-black mb-6 text-left">Our Story</h2>
                <br></br>
                <br></br>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Texto */}
                  <div className="space-y-4">
                    <p className="text-gray-800">
                      BalearTrek is a platform dedicated to discovering the most
                      beautiful trekking routes across the <b>Balearic Islands</b>
                      .
                    </p>

                    <p className="text-gray-800">
                      The idea of BalearTrek was born from a group of local hikers
                      who wanted to share their passion for the islands' natural
                      landscapes and rich cultural heritage.
                    </p>

                    <p className="text-gray-800">
                      Just as King James I discovered the beauty of these islands
                      in 1229, we invite modern explorers to discover their
                      natural wonders through hiking. Each trail tells a story -
                      from ancient talayotic settlements to medieval paths.
                    </p>

                    <p className="text-gray-800">
                      We believe that understanding the history of the land you
                      walk on enhances the hiking experience, connecting you with
                      centuries of Mediterranean culture and tradition.
                    </p>
                  </div>

                  {/* Imagen de Mallorca */}
                  <div className="flex flex-col items-center">
                    <img
                      src="./images/Mallorca.png"
                      alt="Mallorca"
                      className="w-full max-h-[300px] object-cover border border-gray-400 mb-4"
                    />
                    <p className="text-sm text-gray-600 text-center">
                      Mallorca - The largest of the Balearic Islands
                    </p>
                  </div>
                </div>
              </div>
              <br></br>
              <br></br>
              <br></br>
              <br></br>

              {/* Carrusel treks */}
              {trekImages.length > 0 && (
                <div className="bg-white p-6">
                  <h3 className="text-2xl font-bold text-black mb-4 text-left">
                    Explore Our Trails Gallery
                  </h3>
                  <br></br>
                  <br></br>

                  <div className="relative">
                    {/* Imagen grande actual */}
                    <div className="relative h-72 md:h-80 lg:h-96 mb-6">
                      <img
                        src={trekImages[currentCarouselIndex]}
                        alt={`Trail ${currentCarouselIndex + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Flechas de navegación */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-3 hover:bg-black/90 transition"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-3 hover:bg-black/90 transition"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Indicador carrusel */}
                    <div className="text-center mt-4">
                      <div className="inline-flex items-center space-x-2">
                        <span className="text-black">Trail</span>
                        <span className="text-lg font-bold text-lime-500">
                          {currentCarouselIndex + 1}
                        </span>
                        <span className="text-black">of</span>
                        <span className="text-black">{trekImages.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Sección FAQ */}
      <section className="w-full bg-gray-100 py-12 px-4 md:px-8 mt-8">
        <div className="max-w-8xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col items-center text-left">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-black font-semibold text-lg mb-3">
                    {item.question}
                  </h3>
                  <div className="text-gray-700 text-sm">
                    {formatText(item.answer)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}