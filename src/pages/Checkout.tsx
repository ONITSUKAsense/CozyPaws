import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "../i18n/LanguageContext";
import { createOrder, addToCart, fetchCart, removeCartItem } from "../api";

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // Sync local cart items to backend before placing order
      const backendCart = await fetchCart();
      for (const item of backendCart.items) {
        await removeCartItem(item.id);
      }
      for (const item of items) {
        await addToCart({ productId: item.productId, quantity: item.quantity });
      }

      await createOrder({
        shippingAddress: `${form.address}, ${form.city}, ${form.zip}`,
        phone: form.phone,
        note: "",
      });
      clearCart();
      setSuccess(true);
    } catch {
      setError(t("checkout.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-500 mb-4">{t("cart.empty")}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center px-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif-display text-[#1a3d1a] mb-2">
            {t("checkout.success")}
          </h2>
          <p className="text-gray-500 mb-6">
            {t("checkout.successMsg")}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("checkout.backToCart")}
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-8">
          {t("checkout.title")}
        </h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-medium text-lg text-gray-900 mb-4">
              {t("checkout.shippingDetails")}
            </h2>
            <input
              type="text"
              placeholder={t("checkout.fullName")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />
            <input
              type="text"
              placeholder={t("checkout.address")}
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("checkout.city")}
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
              />
              <input
                type="text"
                placeholder={t("checkout.zip")}
                required
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
              />
            </div>
            <input
              type="tel"
              placeholder={t("checkout.phone")}
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
            />
          </div>

          <div>
            <h2 className="font-medium text-lg text-gray-900 mb-4">
              {t("checkout.orderSummary")}
            </h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600 truncate mr-4">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900">{t("checkout.total")}</span>
                <span className="font-bold text-lg text-[#1a3d1a]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            {!isAuthenticated && (
              <p className="text-amber-600 text-sm mt-4">
                {t("checkout.loginPrompt")}{" "}
                <Link to="/login" className="underline font-medium">
                  {t("checkout.loginLink")}
                </Link>{" "}
                {t("checkout.loginPromptEnd")}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#E86A10] hover:bg-[#d45e0d] disabled:bg-gray-300 text-white py-3 rounded-full font-medium mt-6 transition-colors"
            >
              {submitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
