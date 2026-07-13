import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, FileText } from "lucide-react";
import { fetchBlogPosts } from "../../api";
import { deleteBlogPost } from "../../api/admin";
import type { BlogPost } from "../../types";
import { useTranslation } from "../../i18n/LanguageContext";

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setError("Failed to load blog posts"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    await deleteBlogPost(id);
    setError("");
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setError("Failed to reload posts"))
      .finally(() => {});
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
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif-display text-[#1a3d1a]">{t("admin.blog")}</h1>
        <Link
          to="/admin/blog/new"
          className="bg-[#1a3d1a] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 hover:bg-[#2a5a2a]"
        >
          <Plus className="w-4 h-4" /> {t("admin.newPost")}
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("admin.noPosts")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">{t("admin.title")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("admin.author")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("admin.status")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("admin.date")}</th>
                <th className="text-right px-4 py-3 font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3 text-gray-500">{post.author}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.published ? t("admin.published") : t("admin.draft")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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
