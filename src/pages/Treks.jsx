// src/pages/Treks.jsx
import { useState, useMemo } from "react";
import { getTrekDescription } from "../data/trekDescriptions";
import TrekCard from "../components/TrekCard";

const BASE_URL = "http://baleartrek.test";
const ITEMS_PER_PAGE = 6; // Constante para la paginación

export default function Treks({ treks = [], loading, error, trekImages = [] }) {
  // Estados para los filtros
  const [searchText, setSearchText] = useState("");
  const [selectedIslands, setSelectedIslands] = useState([]);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState([]);
  const [minRating, setMinRating] = useState(0);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Función para normalizar datos (igual que en Landing)
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

  // Normalizar los treks
  const normalizedTreks = useMemo(() => {
    if (!treks || !treks.length) return [];
    return treks.map((trek, index) => normalizeTrekData(trek, index));
  }, [treks, trekImages]);

  // Obtener opciones únicas para los filtros
  const allIslands = useMemo(() => {
    const islands = [
      ...new Set(normalizedTreks.map((trek) => trek.island).filter(Boolean)),
    ];
    return islands.sort();
  }, [normalizedTreks]);

  const allMunicipalities = useMemo(() => {
    const municipalities = [
      ...new Set(
        normalizedTreks.map((trek) => trek.municipality).filter(Boolean),
      ),
    ];
    return municipalities.sort();
  }, [normalizedTreks]);

  // Filtrar treks según los filtros seleccionados
  const filteredTreks = useMemo(() => {
    return normalizedTreks.filter((trek) => {
      // Filtro de búsqueda por texto
      const matchesSearch =
        searchText === "" ||
        trek.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        trek.description.toLowerCase().includes(searchText.toLowerCase()) ||
        trek.municipality.toLowerCase().includes(searchText.toLowerCase());

      // Filtro por islas
      const matchesIsland =
        selectedIslands.length === 0 || selectedIslands.includes(trek.island);

      // Filtro por municipios
      const matchesMunicipality =
        selectedMunicipalities.length === 0 ||
        selectedMunicipalities.includes(trek.municipality);

      // Filtro por puntuación mínima
      const matchesRating =
        minRating === 0 || (trek.rating && trek.rating >= minRating);

      return (
        matchesSearch && matchesIsland && matchesMunicipality && matchesRating
      );
    });
  }, [
    normalizedTreks,
    searchText,
    selectedIslands,
    selectedMunicipalities,
    minRating,
  ]);

  // Calcular el total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTreks.length / ITEMS_PER_PAGE);
  }, [filteredTreks]);

  // Obtener los treks de la página actual
  const paginatedTreks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTreks.slice(startIndex, endIndex);
  }, [filteredTreks, currentPage]);

  // Handlers para los filtros
  const handleIslandToggle = (island) => {
    setSelectedIslands((prev) =>
      prev.includes(island)
        ? prev.filter((i) => i !== island)
        : [...prev, island],
    );
    setCurrentPage(1); // Resetear a primera página al filtrar
  };

  const handleMunicipalityToggle = (municipality) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality],
    );
    setCurrentPage(1); // Resetear a primera página al filtrar
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedIslands([]);
    setSelectedMunicipalities([]);
    setMinRating(0);
    setCurrentPage(1); // Resetear a primera página
  };

  // Handlers para la paginación
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba del grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generar array de números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Número máximo de páginas visibles en el paginador

    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Estados de loading y error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading treks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 md:px-8 border-b border-gray-300">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            All Treks
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Explore all our hiking routes in the Balearic Islands
          </p>
        </div>
      </header>

      {/* Main container */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - 1/4 width */}
          <aside className="lg:w-1/4">
            <div className="border border-gray-300 p-6 bg-white shadow-sm">
              <h3 className="text-xl font-bold text-black mb-4">
                Filter Treks
              </h3>

              {/* Contador de resultados */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-sky-600">
                    {filteredTreks.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-sky-600">
                    {normalizedTreks.length}
                  </span>{" "}
                  treks
                </p>
              </div>

              {/* Búsqueda por texto */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name, description, or municipality..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-sky-700 transition"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1); // Resetear a primera página al buscar
                  }}
                />
              </div>

              {/* Filtro por isla */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Filter by Island
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {allIslands.map((island) => (
                    <div key={island} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`island-${island}`}
                        checked={selectedIslands.includes(island)}
                        onChange={() => handleIslandToggle(island)}
                        className="h-4 w-4 text-black rounded focus:ring-sky-400"
                      />
                      <label
                        htmlFor={`island-${island}`}
                        className="ml-2 text-gray-700 cursor-pointer hover:text-sky-400 transition"
                      >
                        {island} (
                        {
                          normalizedTreks.filter((t) => t.island === island)
                            .length
                        }
                        )
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por municipio */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">
                  Filter by Municipality
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {allMunicipalities.map((municipality) => (
                    <div key={municipality} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`municipality-${municipality}`}
                        checked={selectedMunicipalities.includes(municipality)}
                        onChange={() => handleMunicipalityToggle(municipality)}
                        className="h-4 w-4 text-back rounded focus:ring-sky-500"
                      />
                      <label
                        htmlFor={`municipality-${municipality}`}
                        className="ml-2 text-gray-700 cursor-pointer hover:text-sky-400 transition text-sm"
                      >
                        {municipality} (
                        {
                          normalizedTreks.filter(
                            (t) => t.municipality === municipality,
                          ).length
                        }
                        )
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por puntuación */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-3">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="minRating"
                        checked={minRating === rating}
                        onChange={() => {
                          setMinRating(rating);
                          setCurrentPage(1); // Resetear a primera página al cambiar rating
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="ml-2 text-gray-700 cursor-pointer hover:text-blue-700 transition flex items-center"
                      >
                        {rating === 0 ? "Any rating" : `⭐ ${rating}+`}
                        {rating > 0 && (
                          <span className="ml-2 text-gray-500 text-sm">
                            (
                            {
                              normalizedTreks.filter(
                                (t) => t.rating && t.rating >= rating,
                              ).length
                            }
                            )
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón reset */}
              {(searchText ||
                selectedIslands.length > 0 ||
                selectedMunicipalities.length > 0 ||
                minRating > 0) && (
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-gradient-to-r from-sky-400 to-indigo-700 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:w-3/4">
            {/* Grid header */}
            <div className="mb-8 pb-4 border-b border-gray-300">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Available Routes ({filteredTreks.length})
              </h2>
              <p className="text-gray-700 mt-2">
                {filteredTreks.length === normalizedTreks.length
                  ? "All hiking routes"
                  : "Filtered hiking routes"}
              </p>
            </div>

            {/* Grid de treks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedTreks.length > 0 ? (
                paginatedTreks.map((trek) => (
                  <TrekCard key={trek.id} trek={trek} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-lg mb-4">
                      No treks match your filters
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Componente de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
                {/* Botón Anterior */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-400 to-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  Previous
                </button>

                {/* Números de página */}
                <div className="flex space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-sky-400 to-indigo-700 text-white shadow-md transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Botón Next */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-400 to-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Información de paginación */}
            {totalPages > 0 && (
              <div className="text-center text-gray-600 text-sm mt-2">
                Page {currentPage} of {totalPages} • Showing{" "}
                {paginatedTreks.length} of {filteredTreks.length} treks
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
