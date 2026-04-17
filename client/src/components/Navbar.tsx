import { Link, useLocation } from "wouter";
import { ShoppingBag, Star, User, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect } from "react";
import { safeMap } from "@/utils/safeMap";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Gallery" },
    { href: "/stories", label: "Stories" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-8"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-serif tracking-[0.2em] text-white hover:text-yellow-400 transition-colors"
        >
          KALL<span className="text-yellow-400">AA</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-12">
          {safeMap(links, l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all hover:text-yellow-400 ${location === l.href ? "text-yellow-400" : "text-zinc-400"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`p-2 rounded-full transition-colors ${location === "/admin" ? "bg-yellow-400 text-black" : "text-zinc-400 hover:text-white"}`}
            >
              <Shield size={20} />
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hidden sm:inline">
                {user.email || user.name}
              </span>
              <button
                onClick={logout}
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-500 hover:text-red-400 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-white transition-all"
            >
              <User size={18} />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-white/10 animate-fade-in">
          <div className="flex flex-col p-8 gap-6">
            {safeMap(links, l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif"
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif text-yellow-400"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
