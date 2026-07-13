import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/LanguageContext";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1a3d1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif-display text-xl mb-4">CozyPaws</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t("footer.brandDesc")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t("nav.shop")}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              {t("footer.customerService")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t("footer.delivery")}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t("footer.returns")}
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>jxxie3250@gmail.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} CozyPaws. {t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
