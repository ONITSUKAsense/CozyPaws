import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "../i18n/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await register(form);
      setAuth(res.user, res.token);
      navigate("/shop");
    } catch {
      setError(t("register.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h1 className="text-3xl font-serif-display text-[#1a3d1a] text-center mb-2">
            {t("register.title")}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            {t("register.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t("register.name")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />
            <input
              type="email"
              placeholder={t("register.email")}
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />
            <input
              type="password"
              placeholder={t("register.password")}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3d1a] hover:bg-[#2a5a2a] disabled:bg-gray-300 text-white py-3 rounded-full font-medium transition-colors"
            >
              {loading ? t("register.creating") : t("register.createAccount")}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            {t("register.hasAccount")}{" "}
            <Link
              to="/login"
              className="text-[#1a3d1a] font-medium hover:underline"
            >
              {t("register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
