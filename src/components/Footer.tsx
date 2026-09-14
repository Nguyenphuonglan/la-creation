import { MapPin, Phone, Mail, Facebook, MessageCircle } from 'lucide-react';
import { useRouter } from '@/lib/router';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-serif text-stone-100 mb-4">La Creatión</h2>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Kiến tạo không gian sống đẳng cấp — nơi nghệ thuật kiến trúc gặp gỡ
              cuộc sống hiện đại.
            </p>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-5">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <span>123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 shrink-0" />
                <a href="tel:+842839999999" className="hover:text-amber-400 transition-colors">
                  +84 28 3999 9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400 shrink-0" />
                <a href="mailto:info@lacreatión.vn" className="hover:text-amber-400 transition-colors">
                  info@lacreatión.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-5">
              Kết nối
            </h3>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center hover:bg-amber-400 hover:text-stone-900 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center hover:bg-amber-400 hover:text-stone-900 transition-all duration-300"
                aria-label="Zalo"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="mt-6 text-sm text-stone-400 hover:text-amber-400 transition-colors"
            >
              Xem trang liên hệ →
            </button>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} La Creatión. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
