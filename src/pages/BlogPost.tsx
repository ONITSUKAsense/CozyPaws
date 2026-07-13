import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchBlogPost } from "../api";
import { useTranslation } from "../i18n/LanguageContext";
import type { BlogPost as BlogPostType } from "../types";

export default function BlogPost() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchBlogPost(slug)
      .then((p) => {
        setPost(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-500 mb-4">{t("blog.notFound")}</p>
          <Link
            to="/blog"
            className="text-[#1a3d1a] font-medium hover:underline"
          >
            {t("blog.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(post.createdAt).toLocaleDateString(
    t("nav.language") === "EN" ? "en-US" : "zh-CN",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-3xl mx-auto px-4 md:px-12 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("blog.backToBlog")}
        </Link>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {post.author}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-6">
          {post.title}
        </h1>

        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
}
