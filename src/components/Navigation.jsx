import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="w-full bg-black text-white">
      <div
        className="max-w-8xl mx-auto px-7 h-24
                      flex items-center justify-between"
      >
        {/* Logo izquierda */}
        <div className="flex items-center space-x-1">
          <img
            src="/images/baleartrek-green.png"
            alt="BalearTrek Logo"
            className="h-28 w-auto" 
          />
          <div className="text-2xl font-bold italic">BalearTrek</div>
        </div>

        {/* Enlaces centro */}
        <div className="flex gap-12">
          <Link to="/" className="text-lg hover:text-blue-300 transition">
            Home
          </Link>
          <Link to="/treks" className="text-lg hover:text-blue-300 transition">
            Treks
          </Link>
          <Link to="/contact" className="text-lg hover:text-blue-300 transition">
            Contact
          </Link>
          <Link to="/about" className="text-lg hover:text-blue-300 transition">
            About (FAQ)
          </Link>
        </div>

        {/* Enlaces de autenticación */}
        <div className="flex gap-8">
          <Link
            to="/auth"
            className="text-lg hover:text-lime-300 transition"
          >
            Login / Register
          </Link>          
        </div>
      </div>
    </nav>
  );
}
