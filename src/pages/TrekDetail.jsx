import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTrekDescription } from "../data/trekDescriptions";
const BASE_URL = "http://baleartrek.test";

function TrekDetail() {
  const { regNumber } = useParams();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para la inscripción
  const [selectedDate, setSelectedDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [registrationMessage, setRegistrationMessage] = useState("");

  // Fechas futuras aleatorias para el calendario (próximos 2 meses)
  const generateFutureDates = () => {
    const today = new Date();
    const futureDates = [];

    // Generar fechas para los próximos 2 meses (8 fechas)
    for (let i = 1; i <= 8; i++) {
      // Añadir 7, 14, 21, 28, 35, 42, 49, 56 días
      const trekDate = new Date(today);
      trekDate.setDate(today.getDate() + i * 7);

      // Fecha de inicio de inscripción (30 días antes)
      const registrationStartDate = new Date(trekDate);
      registrationStartDate.setDate(trekDate.getDate() - 30);

      // Fecha de fin de inscripción (7 días antes)
      const registrationEndDate = new Date(trekDate);
      registrationEndDate.setDate(trekDate.getDate() - 7);

      // Verificar si la fecha de trek es futura
      if (trekDate > today) {
        futureDates.push({
          id: i,
          date: trekDate.toISOString().split("T")[0],
          trekDate: trekDate,
          registrationStartDate: registrationStartDate,
          registrationEndDate: registrationEndDate,
          display: `${trekDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })} - ${["08:00", "09:00", "10:00"][i % 3]} AM`,
        });
      }
    }

    return futureDates;
  };

  const futureDates = generateFutureDates();

  // Número de personas (1-4)
  const peopleOptions = [1, 2, 3, 4];
  // Función para cargar los detalles del trek
  useEffect(() => {
    const fetchTrek = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching trek from:",
          `http://baleartrek.test/api/treks/${regNumber}`,
        );

        const response = await fetch(
          `http://baleartrek.test/api/treks/${regNumber}`,
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Trek not found`);
        }

        const data = await response.json();
        console.log("Datos recibidos del trek individual:", data);

        let trekData;

        if (data.data) {
          trekData = data.data;
        } else if (data.trek) {
          trekData = data.trek;
        } else {
          trekData = data;
        }

        console.log("Trek extraído:", trekData);

        if (!trekData) {
          throw new Error("No trek data received");
        }

        setTrek(trekData);

        // Inicializar la fecha seleccionada con la primera fecha futura disponible
        if (futureDates.length > 0) {
          setSelectedDate(futureDates[0].date);
        }

        setTotalRegistered(0);
      } catch (fetchError) {
        console.error("Error fetching trek:", fetchError);
        setError(fetchError.message || "Error loading trek details");
      } finally {
        setLoading(false);
      }
    };

    if (regNumber) {
      fetchTrek();
    } else {
      setError("No registration number provided");
      setLoading(false);
    }
  }, [regNumber]);

  // Función para manejar la inscripción/desinscripción con validación de fechas y mensajes de confirmación
  const handleRegistration = () => {
    if (!selectedDate) {
      setRegistrationMessage("Please select a date first!");
      return;
    }

    const selectedFutureDate = futureDates.find(
      (date) => date.date === selectedDate,
    );
    const today = new Date();

    // Verificar si las inscripciones están abiertas para la fecha seleccionada y mostrar mensajes adecuados 
    if (selectedFutureDate) {
      if (today < selectedFutureDate.registrationStartDate) {
        setRegistrationMessage(
          `Registration opens on ${selectedFutureDate.registrationStartDate.toLocaleDateString()}`,
        );
        setTimeout(() => setRegistrationMessage(""), 5000);
        return;
      }

      if (today > selectedFutureDate.registrationEndDate) {
        setRegistrationMessage(
          `Registration closed on ${selectedFutureDate.registrationEndDate.toLocaleDateString()}`,
        );
        setTimeout(() => setRegistrationMessage(""), 5000);
        return;
      }
    }

    if (isRegistered) {
      // Desinscribirse y actualizar el contador de inscritos y mostrar mensaje de confirmación de desinscripción
      setTotalRegistered((prev) => prev - numberOfPeople);
      setIsRegistered(false);
      setRegistrationMessage(
        `Successfully unregistered ${numberOfPeople} person(s) from ${selectedDate}`,
      );

      // Limpiar el mensaje después de 9 segundos para dar tiempo a leer la confirmación
      setTimeout(() => setRegistrationMessage(""), 9000);
    } else {
      // Inscribirse
      setTotalRegistered((prev) => prev + numberOfPeople);
      setIsRegistered(true);
      setRegistrationMessage(
        `Successfully registered ${numberOfPeople} person(s) for ${selectedDate}`,
      );

      // Limpiar el mensaje después de 9 segundos para dar tiempo a leer 
      setTimeout(() => setRegistrationMessage(""), 9000);
    }
  };

  // Función para verificar si las inscripciones están abiertas para una fecha 
  const isRegistrationOpenForDate = (date) => {
    const selectedFutureDate = futureDates.find((d) => d.date === date);
    if (!selectedFutureDate) return false;

    const today = new Date();
    return (
      today >= selectedFutureDate.registrationStartDate &&
      today <= selectedFutureDate.registrationEndDate
    );
  };

  // Función para obtener el estado de la inscripción para una fecha (es decir, si aún no se ha abierto, si está abierta o si ya se ha cerrado) y mostrarlo en el calendario desplegable
  const getRegistrationStatusForDate = (date) => {
    const selectedFutureDate = futureDates.find((d) => d.date === date);
    if (!selectedFutureDate) return "unknown";

    const today = new Date();

    if (today < selectedFutureDate.registrationStartDate) {
      return "not_yet_open";
    } else if (today > selectedFutureDate.registrationEndDate) {
      return "closed";
    } else {
      return "open";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trek details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Trek Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error.includes("404")
              ? `The trek with registration number ${regNumber} was not found.`
              : error}
          </p>
        </div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Trek not found</p>
      </div>
    );
  }
  // Manejar casos donde los datos pueden estar en diferentes formatos o campos alternativos
  const trekName = trek.nom || trek.name || "Unnamed Trek";
  const trekMunicipality =
    typeof trek.municipality === "string"
      ? trek.municipality
      : trek.municipality?.name || trek.municipi || "Unknown";
  const trekIsland =
    typeof trek.island === "string"
      ? trek.island
      : trek.municipality?.island?.name || trek.illa || "Unknown";
  const trekImage = trek.imageUrl
    ? `${BASE_URL}/${trek.imageUrl}`
    : "https://via.placeholder.com/400x300?text=Trek+Image";
  const trekDescription = getTrekDescription(regNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={trekImage}
          alt={trekName}
          className="w-full h-full object-cover object-[center_calc(50%-60px)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-8xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {trekName}
            </h1>
            <div className="flex items-center text-white">
              <span className="font-medium">{trekMunicipality}</span>
              <span className="mx-2">•</span>
              <span>{trekIsland}</span>
              {trek.score?.average && (
                <>
                  <span className="mx-2">•</span>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    ⭐ {trek.score.average.toFixed(1)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del trek e inscripción */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm p-6 mb-6 border border-gray-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Trek Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-m text-gray-500 mb-1">
                    Registration Number
                  </div>
                  <div className="font-medium text-gray-900">
                    {trek.regNumber || regNumber}
                  </div>
                </div>
                <div>
                  <div className="text-m text-gray-500 mb-1">Status</div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-m font-medium ${
                      trek.status === "a"
                        ? "bg-green-100 text-green-800"
                        : trek.status === "n"
                          ? "bg-sky-100 text-sky-600"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {trek.status === "a"
                      ? "Active"
                      : trek.status === "n"
                        ? "New"
                        : "Unknown"}
                  </div>
                </div>
                <div>
                  <div className="text-m text-gray-500 mb-1">
                    Overall Rating
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-gray-900 mr-2">
                      {trek.score?.average?.toFixed(1) || "N/A"}
                    </div>
                    <div className="text-yellow-400 text-2xl">★★★★★</div>
                  </div>
                </div>
                <div>
                  <div className="text-m text-gray-500 mb-1">Municipality</div>
                  <div className="font-medium text-gray-900">
                    {trekMunicipality}
                  </div>
                </div>
                <div>
                  <div className="text-m text-gray-500 mb-1">Island</div>
                  <div className="font-medium text-gray-900">{trekIsland}</div>
                </div>

                {/* Reuniones pasadas */}
                {trek.meetings && trek.meetings.length > 0 && (
                  <div>
                    <div className="text-m text-gray-500 mb-1">
                      Past Meetings
                    </div>
                    <div className="font-medium text-gray-900">
                      {trek.meetings.length} historical dates
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nueva sección de inscripción */}
            <div className="bg-white shadow-sm p-6 mb-6 border border-gray-300 hover:border-2 hover:border-lime-400">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Register for Upcoming Dates
              </h3>

              {/* Mensaje de confirmación */}
              {registrationMessage && (
                <div
                  className={`mb-4 p-3 rounded-lg text-m font-medium ${
                    isRegistered
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : registrationMessage.includes("Registration opens") ||
                          registrationMessage.includes("Registration closed")
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {registrationMessage}
                </div>
              )}

              {/* Calendario desplegable */}
              <div className="mb-4">
                <label className="block text-m font-medium text-gray-700 mb-2">
                  Select Upcoming Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  disabled={isRegistered}
                >
                  {futureDates.map((dateOption) => {
                    const status = getRegistrationStatusForDate(
                      dateOption.date,
                    );
                    let displayText = dateOption.display;

                    if (status === "not_yet_open") {
                      displayText +=
                        " (Opens " +
                        dateOption.registrationStartDate.toLocaleDateString() +
                        ")";
                    } else if (status === "closed") {
                      displayText += " (Closed)";
                    } else {
                      displayText += " (Open)";
                    }

                    return (
                      <option key={dateOption.id} value={dateOption.date}>
                        {displayText}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Mostrar información de inscripción para la fecha seleccionada */}
              {selectedDate && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <div className="font-bold text-m text-indigo-800 mb-1">
                    Registration Period for Selected Date:
                  </div>
                  <div className="text-m text-gray-700">
                    <div className="flex justify-between">
                      <span>From:</span>
                      <span className="font-medium">
                        {futureDates
                          .find((d) => d.date === selectedDate)
                          ?.registrationStartDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span className="font-medium">
                        {futureDates
                          .find((d) => d.date === selectedDate)
                          ?.registrationEndDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 pt-2">
                      <div className="flex justify-between">
                        <span>Trek Date:</span>
                        <span className="font-bold text-indigo-800">
                          {futureDates
                            .find((d) => d.date === selectedDate)
                            ?.trekDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Número de personas desplegable */}
              <div className="mb-6">
                <label className="block text-m font-medium text-gray-700 mb-2">
                  Select Number of People
                </label>
                <select
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  disabled={
                    isRegistered || !isRegistrationOpenForDate(selectedDate)
                  }
                >
                  {peopleOptions.map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de inscripción/desinscripción */}
              <button
                onClick={handleRegistration}
                disabled={!isRegistrationOpenForDate(selectedDate)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg ${
                  !isRegistrationOpenForDate(selectedDate)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isRegistered
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white"
                      : "bg-gradient-to-r from-lime-500 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
                }`}
              >
                {!isRegistrationOpenForDate(selectedDate) ? (
                  <span className="flex items-center justify-center">
                    {getRegistrationStatusForDate(selectedDate) ===
                    "not_yet_open"
                      ? "Registration Not Yet Open"
                      : "Registration Closed"}
                  </span>
                ) : isRegistered ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Unregister ({numberOfPeople} person
                    {numberOfPeople > 1 ? "s" : ""})
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Register now
                  </span>
                )}
              </button>

              {/* Contador de nuevos inscritos */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-m text-gray-600">
                    Total registered:
                  </span>
                  <span className="font-bold text-m text-lime-600">
                    {totalRegistered}{" "}
                    {totalRegistered === 1 ? "person" : "people"}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de acción */}
            <div>
              <Link
                to="/treks"
                className="block w-full text-center bg-gradient-to-r from-sky-400 to-indigo-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg mb-4"
              >
                Explore More Treks
              </Link>
            </div>
          </div>

          {/* Información principal */}
          <div className="lg:col-span-2">
            <div className="border border-gray-300 bg-white shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {trekDescription}
              </p>

              {/* Lugares interesantes */}
              {trek.interesting_places &&
                trek.interesting_places.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Places of Interest Along the Route
                    </h3>
                    <div className="space-y-4">
                      {trek.interesting_places.map((place) => (
                        <div
                          key={place.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-sky-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-black text-lg">
                              {place.name}
                            </h4>
                            <div className="text-grey-800 px-2 py-1 rounded text-sm font-medium">
                              Order: {place.order}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <div className="flex items-center">
                              <span className="ml-1 text-gray-600">Type:</span>
                              <span className="ml-1 text-sky-600">
                                {place.place_type?.name || "Not specified"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="w-4 h-4 text-gray-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-gray-700 font-medium">
                                Coordinates:
                              </span>
                              <span className="ml-1 text-gray-600">
                                {place.gps || "Not available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Meetings si existen */}
            {trek.meetings && trek.meetings.length > 0 && (
              <div className="bg-white border border-gray-300 shadow-sm p-6">
                <h2 className="text-2xl font-bold text-black mb-4">
                  Past Meetings
                </h2>
                <div className="space-y-6">
                  {trek.meetings.map((meeting) => {
                    // Extraer datos del meeting
                    const meetingDay = meeting.day
                      ? new Date(meeting.day)
                      : null;
                    const meetingHour =
                      meeting.hour?.substring(0, 5) || "Unknown";
                    const appDateIni = meeting.appDateIni
                      ? new Date(meeting.appDateIni)
                      : null;
                    const appDateEnd = meeting.appDateEnd
                      ? new Date(meeting.appDateEnd)
                      : null;
                    const totalParticipants = meeting.attendees?.length || 0;
                    const guideName = meeting.guide?.name || "Not assigned";
                    const guideLastName = meeting.guide?.lastname || "";
                    const guideEmail = meeting.guide?.email || "";
                    const totalComments = meeting.comments?.length || 0;

                    return (
                      <div
                        key={meeting.id}
                        className="border border-gray-200 p-5 transition-colors shadow-sm hover:shadow-md bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            {meetingDay ? (
                              <div>
                                <div className=" text-black text-lg mb-1">
                                  {meetingDay.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className=" text-gray-900 text-lg mb-1">
                                Date not specified
                              </div>
                            )}
                            <div className=" text-black text-lg mb-1">
                              <span>Time:</span> {meetingHour}
                            </div>

                            {/* Información del guía */}
                            <div className="mb-3">
                              <div className="font-bold text-m mt-1 text-sky-600">
                                Guide Information
                              </div>
                              <div className="text-sky-600 text-m mt-1">
                                <span className="font-medium">Name:</span>{" "}
                                {guideName} {guideLastName}
                              </div>
                              {guideEmail && (
                                <div className="text-sky-600 text-m mt-1">
                                  <span className="font-medium">Email:</span>{" "}
                                  {guideEmail}
                                </div>
                              )}
                            </div>

                            {/* Número de participantes (histórico) */}
                            <div className="mb-3">
                              <div className="font-medium text-black">
                                Attendance:
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="text-gray-800 text-m">
                                  {totalParticipants} total participants
                                </div>
                              </div>
                            </div>
                          </div>
                          {meeting.score?.average && (
                            <div className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-sm font-medium">
                              ⭐ {meeting.score.average.toFixed(1)}
                            </div>
                          )}
                        </div>

                        {appDateIni && appDateEnd && (
                          <div className="text-m text-gray-500 mb-4 bg-grey-100 rounded">
                            <div className="font-medium text-amber-700 mb-1">
                              Registration (Closed)
                            </div>
                            <div>
                              From:{" "}
                              {new Date(
                                appDateIni.getTime() - 30 * 24 * 60 * 60 * 1000,
                              ).toLocaleDateString()}
                            </div>
                            <div>
                              To:{" "}
                              {new Date(
                                appDateIni.getTime() - 7 * 24 * 60 * 60 * 1000,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        )}

                        {/* Todos los comentarios con 1 imagen */}
                        {meeting.comments && meeting.comments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <div className="font-medium text-black">
                                Comments ({totalComments})
                              </div>
                            </div>
                            <div className="space-y-4">
                              {meeting.comments.map((comment, index) => {
                                const imageUrl = `https://via.placeholder.com/640x480.png/0022ff?text=${comment.id || "comment"}`;

                                return (
                                  <div
                                    key={comment.id || index}
                                    className="bg-white rounded-lg p-4 border border-gray-100"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="font-medium text-indigo-700">
                                          {comment.user?.name}{" "}
                                          {comment.user?.lastname}
                                        </div>
                                        {meetingDay && (
                                          <div className="text-xs text-gray-500">
                                            {meetingDay.toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                      {comment.score !== undefined &&
                                        comment.score !== null && (
                                          <div className="flex items-center bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-sm font-medium">
                                            <span className="mr-1">★</span>
                                            {comment.score}/5
                                          </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mt-2">
                                      {comment.comment}
                                    </p>

                                    {/* Una sola imagen por comentario */}
                                    <div className="mt-3">
                                      <img
                                        src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='440' height='280' viewBox='0 0 320 240'%3E%3Crect width='440' height='280' fill='%ffffff'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EComment ${comment.id}%3C/text%3E%3C/svg%3E`}
                                        alt={`Comment ${comment.id}`}
                                        className="rounded-lg border border-gray-200 w-40 max-w-md h-32 object-cover"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Si no hay comentarios */}
                        {(!meeting.comments ||
                          meeting.comments.length === 0) && (
                          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                            <div className="text-gray-500 italic py-2">
                              No comments for this meeting
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrekDetail;
