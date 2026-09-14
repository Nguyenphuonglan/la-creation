import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Phone, Mail, Clock, Facebook, MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStatus('loading');
    const { error } = await supabase.from('consultations').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message || null,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 bg-stone-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4">
            Liên hệ
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-100 mb-4">
            Kết nối cùng La Creatión
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình
            kiến tạo không gian lý tưởng.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                <MapPin size={22} className="text-amber-600" />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-stone-800 mb-2">Địa chỉ</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                123 Lê Lợi, Quận 1<br />TP. Hồ Chí Minh, Việt Nam
              </p>
            </div>

            <div className="bg-white p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                <Phone size={22} className="text-amber-600" />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-stone-800 mb-2">Điện thoại</h3>
              <a href="tel:+842839999999" className="text-stone-600 text-sm hover:text-amber-600 transition-colors">
                +84 28 3999 9999
              </a>
            </div>

            <div className="bg-white p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                <Mail size={22} className="text-amber-600" />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-stone-800 mb-2">Email</h3>
              <a href="mailto:info@lacreatión.vn" className="text-stone-600 text-sm hover:text-amber-600 transition-colors">
                info@lacreatión.vn
              </a>
            </div>

            <div className="bg-white p-8 shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                <Clock size={22} className="text-amber-600" />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-stone-800 mb-2">Giờ làm việc</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Thứ 2 – Thứ 6: 8:30 – 18:00<br />Thứ 7: 9:00 – 12:00
              </p>
            </div>
          </div>

          {/* About + consultation form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading text-3xl text-stone-800 mb-6">
                Về La Creatión
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                La Creatión là studio kiến trúc và thiết kế nội thất được thành lập
                với sứ mệnh kiến tạo những không gian sống và làm việc đẳng cấp.
                Chúng tôi kết hợp tư duy thiết kế đương đại với kỹ thuật xây dựng
                tinh xảo, mang đến những công trình bền vững, thẩm mỹ và đầy cảm hứng.
              </p>
              <p className="text-stone-600 leading-relaxed mb-8">
                Với đội ngũ kiến trúc sư và nhà thiết kế giàu kinh nghiệm, La Creatión
                đã hoàn thiện hàng trăm dự án đa quy mô — từ biệt thự nghỉ dưỡng,
                văn phòng thương mại đến khách sạn và không gian nội thất cao cấp.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center hover:bg-amber-400 hover:text-stone-900 text-stone-100 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center hover:bg-amber-400 hover:text-stone-900 text-stone-100 transition-all duration-300"
                  aria-label="Zalo"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Consultation form */}
            <div className="bg-stone-900 p-10">
              <h3 className="font-heading text-2xl text-stone-100 mb-2">
                Đăng ký tư vấn
              </h3>
              <p className="text-stone-400 text-sm mb-8">
                Để lại thông tin, chúng tôi sẽ liên hệ trong vòng 24 giờ.
              </p>

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 size={48} className="text-amber-400 mb-4" />
                  <p className="text-lg text-stone-100 font-serif mb-2">Đăng ký thành công!</p>
                  <p className="text-stone-400 text-sm">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
                      placeholder="09xx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Nội dung tư vấn
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                      placeholder="Mô tả ngắn gọn về dự án của bạn..."
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-400 text-sm">
                      Có lỗi xảy ra. Vui lòng thử lại.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-amber-400 text-stone-900 text-sm uppercase tracking-widest font-medium hover:bg-amber-300 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Đang gửi...
                      </>
                    ) : (
                      <>
                        Gửi đăng ký <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
