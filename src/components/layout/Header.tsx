import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Globe } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../i18n/LanguageContext";

const LOGO_URL =
  "https://polo-pecan-73837341.figma.site/_assets/v11/0ae29d6d9628bede667f90d57bebe81b8f1ec2bf.svg";

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E86A10] border-2 border-[#EFFDF0] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, lang, toggleLang } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { to: string; labelKey: string }[] = [
    { to: "/", labelKey: "nav.home" },
    { to: "/shop", labelKey: "nav.shop" },
    { to: "/about", labelKey: "nav.about" },
    { to: "/blog", labelKey: "nav.blog" },
    { to: "/contact", labelKey: "nav.contact" },
  ];

  return (
    <header className="shrink-0 w-full px-4 md:px-12 py-4 relative z-30 flex items-center justify-between bg-[#EFFDF0]">
      <Link to="/" className="shrink-0">
        <img
          src={LOGO_URL}
          alt="CozyPaws"
          className="w-[130px] md:w-[205px] h-auto"
        />
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => navigate("/shop")}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
          title={t("nav.search")}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Language switch */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title={t("nav.language")}
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === "zh" ? "EN" : "中文"}
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          <Badge count={itemCount} />
        </button>

        {user ? (
          <div className="hidden sm:flex items-center gap-2">
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="text-xs font-medium text-[#1a3d1a] hover:underline"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => navigate("/orders")}
              className="text-xs font-medium text-[#1a3d1a] hover:underline"
            >
              {t("nav.myOrders")}
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              {t("nav.logout")}
            </button>
            <div className="w-10 h-10 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:inline text-sm font-medium text-[#1a3d1a] hover:underline"
          >
            {t("nav.signIn")}
          </button>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600"
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-[#1a3d1a] py-2"
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <hr className="border-gray-200" />
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm font-medium text-[#1a3d1a] py-2"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-[#1a3d1a] py-2"
                >
                  {t("nav.myOrders")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="block text-sm text-red-500 py-2"
                >
                  {t("nav.logout")} ({user.name})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-[#1a3d1a] py-2"
              >
                {t("nav.signIn")}
              </Link>
            )}
            <hr className="border-gray-200" />
            <button
              onClick={() => {
                toggleLang();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm text-gray-600 py-2"
            >
              <Globe className="w-4 h-4" />
              {lang === "zh" ? "English" : "中文"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
