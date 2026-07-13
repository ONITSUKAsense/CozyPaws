import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchProduct } from "../../api";
import { createProduct, updateProduct } from "../../api/admin";
import ImageUpload from "../../components/ui/ImageUpload";
import { useTranslation } from "../../i18n/LanguageContext";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "", images: "", categoryId: "1",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProduct(Number(id))
        .then((p) => {
          setForm({
            name: p.name,
            description: p.description,
            price: p.price.toString(),
            stock: p.stock.toString(),
            images: p.images.join(","),
            categoryId: p.categoryId.toString(),
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images,
        categoryId: Number(form.categoryId),
      };
      if (isEdit) {
        await updateProduct(Number(id), body);
      } else {
        await createProduct(body);
      }
      navigate("/admin/products");
    } catch {
      alert(t("admin.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] mb-6">
        <ArrowLeft className="w-4 h-4" /> {t("admin.backToProducts")}
      </Link>
      <h1 className="text-2xl font-serif-display text-[#1a3d1a] mb-6">
        {isEdit ? t("admin.editProduct") : t("admin.newProduct")}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.name")}</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.description")}</label>
          <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.price")}</label>
            <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.stock")}</label>
            <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.imageUpload")}</label>
          <ImageUpload value={form.images} onChange={(url) => setForm({ ...form, images: url })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.categoryId")}</label>
          <input type="number" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <button type="submit" disabled={saving}
          className="bg-[#1a3d1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a5a2a] disabled:bg-gray-300">
          {saving ? t("admin.saving") : t("admin.save")}
        </button>
      </form>
    </div>
  );
}
