import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Tags, FileText, LogOut, Globe } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../i18n/LanguageContext";
import ErrorBoundary from "../../components/ErrorBoundary";

const NAV_ITEMS = [
  { to: "/admin", labelKey: "admin.dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", labelKey: "admin.products", icon: Package },
  { to: "/admin/orders", labelKey: "admin.orders", icon: ShoppingCart },
  { to: "/admin/categories", labelKey: "admin.categories", icon: Tags },
  { to: "/admin/blog", labelKey: "admin.blog", icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t, lang, toggleLang } = useTranslation();

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("admin.accessDenied")}</p>
          <Link to="/" className="text-[#1a3d1a] underline">{t("admin.goHome")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1a3d1a] text-white flex flex-col min-h-screen">
        <div className="px-5 py-6">
          <Link to="/admin" className="font-serif-display text-lg">CozyPaws</Link>
          <p className="text-xs text-gray-400 mt-0.5">{t("admin.panel")}</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.end
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-white/15 text-white font-medium" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/20 space-y-1">
          <button
            onClick={toggleLang}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white w-full"
          >
            <Globe className="w-4 h-4" />
            {lang === "zh" ? "English" : "中文"}
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white w-full"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t("admin.viewSite")}
          </Link>
          <button
            onClick={() => { logout(); window.location.href = "/"; }}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white w-full"
          >
            <LogOut className="w-4 h-4" />
            {t("admin.logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
