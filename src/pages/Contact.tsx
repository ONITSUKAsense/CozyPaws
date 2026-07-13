import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="flex-1 bg-[#EFFDF0]">
      <div className="max-w-4xl mx-auto px-4 md:px-12 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1a3d1a] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("contact.backToHome")}
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif-display text-[#1a3d1a] mb-8">
          {t("contact.title")}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#E86A10] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">{t("contact.email")}</h3>
                  <p className="text-sm text-gray-500">jxxie3250@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-[#E86A10] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">{t("contact.phone")}</h3>
                  <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#E86A10] mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">{t("contact.address")}</h3>
                  <p className="text-sm text-gray-500">123 Pet Street, New York, NY 10001</p>
                </div>
              </div>
            </div>

            {sent ? (
              <div className="bg-green-50 rounded-2xl p-6 text-center">
                <Send className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-medium">
                  {t("contact.success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder={t("contact.formName")}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
                />
                <input
                  type="email"
                  placeholder={t("contact.formEmail")}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a]"
                />
                <textarea
                  placeholder={t("contact.formMessage")}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3d1a]/20 focus:border-[#1a3d1a] resize-none"
                />
                <button
                  type="submit"
                  className="bg-[#E86A10] hover:bg-[#d45e0d] text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                  {t("contact.send")}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden h-full min-h-[300px] bg-gray-200">
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Map placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
