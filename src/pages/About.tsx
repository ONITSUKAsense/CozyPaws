import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Truck, Leaf } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useTranslation();

  const values = [
    { icon: Heart, title: t("about.value1Title"), desc: t("about.value1Desc") },
    { icon: Shield, title: t("about.value2Title"), desc: t("about.value2Desc") },
    { icon: Truck, title: t("about.value3Title"), desc: t("about.value3Desc") },
    { icon: Leaf, title: t("about.value4Title"), desc: t("about.value4Desc") },
  ];

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-6">
          {t("about.title")}
        </h1>

        <p className="text-gray-600 leading-relaxed mb-10">
          {t("about.desc")}
        </p>

        <h2 className="text-2xl font-serif-display text-[#1a3d1a] mb-6">
          {t("about.values")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
              <v.icon className="w-8 h-8 text-[#E86A10] mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-serif-display text-[#1a3d1a] mb-4">
            {t("about.cta")}
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#E86A10] text-white px-8 py-3 rounded-full font-medium"
          >
            {t("about.shopNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
