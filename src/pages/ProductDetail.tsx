import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProduct } from "../api";
import { useCartStore } from "../store/cartStore";
import { useTranslation } from "../i18n/LanguageContext";
import type { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(Number(id))
      .then((p) => {
        setProduct(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1a3d1a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 bg-[#EFFDF0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t("product.notFound")}</p>
          <Link
            to="/shop"
            className="text-[#1a3d1a] font-medium hover:underline"
          >
            {t("product.backToShop")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("product.backToShop")}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>
            <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-[#E86A10]" fill="#E86A10" />
              <span className="font-medium text-sm">{product.rating}</span>
              <span className="text-gray-400 text-sm">
                ({product.reviewCount} {t("product.reviews")})
              </span>
            </div>

            <p className="text-3xl font-bold text-[#1a3d1a] mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <p className="text-sm mb-6">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  {t("product.inStock")} ({product.stock} {product.stock > 1 ? "items" : "item"})
                </span>
              ) : (
                <span className="text-red-500">{t("product.outOfStock")}</span>
              )}
            </p>

            <button
              onClick={() => {
                addItem({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                  quantity: 1,
                });
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              className="bg-[#E86A10] hover:bg-[#d45e0d] text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? t("product.addedToCart") : t("product.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
