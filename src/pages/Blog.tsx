import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchBlogPosts } from "../api";
import { useTranslation } from "../i18n/LanguageContext";
import type { BlogPost } from "../types";

export default function Blog() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-8">
          {t("blog.title")}
        </h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[16/9] bg-gray-100">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(post.createdAt).toLocaleDateString(
                      t("nav.language") === "EN" ? "en-US" : "zh-CN",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </p>
                  <h2 className="font-medium text-gray-900 mb-2 group-hover:text-[#1a3d1a] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-[#E86A10] font-medium mt-3 group-hover:gap-2 transition-all">
                    {t("blog.readMore")} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
