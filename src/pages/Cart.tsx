import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useTranslation } from "../i18n/LanguageContext";

export default function Cart() {
  const { t } = useTranslation();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total());

  if (items.length === 0) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t("cart.empty")}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#1a3d1a] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2a5a2a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          {t("cart.title")}
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm md:text-base text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-[#1a3d1a] font-bold text-sm mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium text-sm">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">{t("cart.subtotal")}</span>
            <span className="font-bold text-lg text-[#1a3d1a]">
              ${total.toFixed(2)}
            </span>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-[#E86A10] hover:bg-[#d45e0d] text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {t("cart.proceedToCheckout")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
