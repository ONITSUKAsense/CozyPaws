import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { fetchCategories } from "../../api";
import { createCategory, updateCategory, deleteCategory } from "../../api/admin";
import type { Category } from "../../types";
import { useTranslation } from "../../i18n/LanguageContext";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing.id, form);
      } else {
        await createCategory(form);
      }
      setForm({ name: "", slug: "" });
      setEditing(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      alert(t("admin.saveFailed"));
    }
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await deleteCategory(id);
    const data = await fetchCategories();
    setCategories(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-serif-display text-[#1a3d1a] mb-6">{t("admin.categories")}</h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-medium text-gray-900 mb-4">
            {editing ? t("admin.editCategory") : t("admin.newCategory")}
          </h2>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.name")}</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.slug")}</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
            </div>
            <div className="flex gap-2">
              <button type="submit"
                className="bg-[#1a3d1a] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2a5a2a]">
                {editing ? t("admin.update") : t("admin.create")}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ name: "", slug: "" }); }}
                  className="text-sm text-gray-500 hover:text-gray-700">
                  {t("common.cancel")}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">{t("admin.name")}</th>
                  <th className="text-left px-4 py-3 font-medium">{t("admin.slug")}</th>
                  <th className="text-right px-4 py-3 font-medium">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{cat.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(cat)}
                          className="p-1.5 text-gray-400 hover:text-blue-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
