import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import { fetchProducts, type ProductsResponse } from "../../api";
import { deleteProduct } from "../../api/admin";
import { useTranslation } from "../../i18n/LanguageContext";

export default function AdminProducts() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const load = () => {
    setLoading(true);
    setError("");
    fetchProducts({ page: 0, size: 100 })
      .then(setData)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await deleteProduct(id);
    load();
  };

  const filtered = data?.content.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif-display text-[#1a3d1a]">{t("admin.products")}</h1>
        <Link
          to="/admin/products/new"
          className="bg-[#1a3d1a] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-[#2a5a2a]"
        >
          <Plus className="w-4 h-4" /> {t("admin.addProduct")}
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t("admin.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-xs rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">{t("admin.noProducts")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">{t("admin.name")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("admin.category")}</th>
                <th className="text-right px-4 py-3 font-medium">{t("admin.price")}</th>
                <th className="text-right px-4 py-3 font-medium">{t("admin.stock")}</th>
                <th className="text-right px-4 py-3 font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.categoryName}</td>
                  <td className="px-4 py-3 text-right">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
