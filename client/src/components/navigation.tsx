import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", hash: "#home" },
    { path: "/articles", label: "Articles", hash: "#articles" },
    { path: "/contact", label: "Contact", hash: "#contact" },
    { path: "/admin-login", label: "Admin", hash: "#admin" },
  ];

  const handleNavClick = (path: string, hash: string) => {
    setIsMenuOpen(false);
    if (location === "/" && hash) {
      // If on homepage and has hash, scroll to section
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold gradient-text cursor-pointer">
              MFWORLD
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`hover:text-neon-cyan transition-colors duration-300 ${
                  location === item.path ? "text-neon-cyan" : ""
                }`}
                onClick={() => handleNavClick(item.path, item.hash)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block hover:text-neon-cyan transition-colors duration-300 ${
                  location === item.path ? "text-neon-cyan" : ""
                }`}
                onClick={() => handleNavClick(item.path, item.hash)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
