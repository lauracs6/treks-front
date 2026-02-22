export default function TestimonyCard({ image, text, name }) {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex flex-col items-center text-center">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full object-cover mb-4"
        />
        <p className="text-gray-800 mb-4 italic">
          "{text}"
        </p>
        <span className="text-gray-800 font-medium">
          {name}
        </span>
      </div>
    </div>
  );
}
