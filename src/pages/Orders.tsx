import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { fetchOrders } from "../api";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "../i18n/LanguageContext";
import type { Order } from "../types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-600 bg-yellow-50",
  PAID: "text-blue-600 bg-blue-50",
  SHIPPED: "text-purple-600 bg-purple-50",
  DELIVERED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const STATUS_LABELS: Record<string, Record<string, string>> = {
  zh: { PENDING: "待处理", PAID: "已付款", SHIPPED: "已发货", DELIVERED: "已送达", CANCELLED: "已取消" },
  en: { PENDING: "Pending", PAID: "Paid", SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled" },
};

export default function Orders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lang = t("nav.language") === "EN" ? "en" : "zh";

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setError("");
    fetchOrders()
      .then(setOrders)
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, [isAuthenticated, t]);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t("orders.loginPrompt")}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium"
          >
            {t("nav.signIn")}
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-8 flex items-center gap-3">
          <Package className="w-8 h-8" />
          {t("orders.title")}
        </h1>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{t("orders.empty")}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("orders.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString(
                        lang === "en" ? "en-US" : "zh-CN",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[order.status] || "text-gray-600 bg-gray-50"
                    }`}
                  >
                    {(STATUS_LABELS[lang] || STATUS_LABELS.en)[order.status] || order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {item.productName} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-400">
                      +{order.items.length - 3} {t("orders.moreItems")}
                    </p>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-gray-900">{t("orders.total")}</span>
                  <span className="font-bold text-[#1a3d1a]">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
