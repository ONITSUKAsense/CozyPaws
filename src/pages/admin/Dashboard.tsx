import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { fetchDashboard, type DashboardData } from "../../api/admin";
import { useTranslation } from "../../i18n/LanguageContext";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => {});
  }, []);

  const cards = [
    { label: t("admin.products"), value: data?.productCount ?? 0, icon: Package, color: "bg-blue-500" },
    { label: t("admin.orders"), value: data?.orderCount ?? 0, icon: ShoppingCart, color: "bg-orange-500" },
    { label: "Users", value: data?.userCount ?? 0, icon: Users, color: "bg-green-500" },
    { label: t("admin.totalRevenue"), value: `$${data?.totalRevenue.toFixed(2) ?? "0.00"}`, icon: DollarSign, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif-display text-[#1a3d1a] mb-6">{t("admin.dashboard")}</h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg ${c.color} flex items-center justify-center`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-xl font-bold text-gray-900">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/products" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <Package className="w-8 h-8 text-[#1a3d1a] mb-3" />
          <h2 className="font-medium text-gray-900">{t("admin.manageProducts")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("admin.manageProductsDesc")}</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <ShoppingCart className="w-8 h-8 text-[#1a3d1a] mb-3" />
          <h2 className="font-medium text-gray-900">{t("admin.manageOrders")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("admin.manageOrdersDesc")}</p>
        </Link>
      </div>
    </div>
  );
}
