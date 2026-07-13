import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createBlogPost, updateBlogPost, fetchBlogPostById } from "../../api/admin";
import ImageUpload from "../../components/ui/ImageUpload";
import { useTranslation } from "../../i18n/LanguageContext";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "", author: "", published: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBlogPostById(Number(id))
        .then((p) => {
          setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: p.content,
            coverImage: p.coverImage,
            author: p.author,
            published: p.published,
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
      const body = { ...form };
      if (isEdit) {
        await updateBlogPost(Number(id), body);
      } else {
        await createBlogPost(body);
      }
      navigate("/admin/blog");
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
      <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] mb-6">
        <ArrowLeft className="w-4 h-4" /> {t("admin.backToBlog")}
      </Link>
      <h1 className="text-2xl font-serif-display text-[#1a3d1a] mb-6">
        {isEdit ? t("admin.editPost") : t("admin.newPost")}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.title")}</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.slug")}</label>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.author")}</label>
          <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.coverImage")}</label>
          <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.description")}</label>
          <textarea required rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.content")}</label>
          <textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 font-mono" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300" />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">{t("admin.publishToggle")}</label>
        </div>
        <button type="submit" disabled={saving}
          className="bg-[#1a3d1a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2a5a2a] disabled:bg-gray-300">
          {saving ? t("admin.saving") : t("admin.save")}
        </button>
      </form>
    </div>
  );
}
