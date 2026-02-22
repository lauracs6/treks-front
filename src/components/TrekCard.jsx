import { Link } from "react-router-dom";

export default function TrekCard({ trek }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-[500px]">
      {/* Imagen */}
      <div className="h-[200px] overflow-hidden">
        <img
          src={trek.image}
          alt={trek.imageAlt}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Título */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[56px]">
            {trek.nom}
          </h3>
        </div>

        {/* Descripción */}
        <div className="mb-6 flex-grow">
          <p className="text-gray-700 text-m leading-relaxed line-clamp-3 min-h-[72px]">
            {trek.description}
          </p>
        </div>

        {/* Información y rating */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-800 font-medium text-sm">
                {trek.municipality}
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">
              {trek.island}
            </span>
          </div>

          {/* Rating */}
          {trek.rating && (
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                trek.rating >= 4.5
                  ? "bg-green-100 text-green-800"
                  : trek.rating >= 4
                    ? "bg-blue-100 text-blue-800"
                    : trek.rating >= 3
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {trek.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Botón detalles */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/treks/${trek.regNumber}`}
            className="block w-full text-center bg-gradient-to-r from-sky-400 to-indigo-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Show Details
          </Link>
        </div>
      </div>
    </div>
  );
}
       