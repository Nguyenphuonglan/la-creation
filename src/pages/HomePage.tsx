import { useState } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import ProtectedImage from '@/components/ProtectedImage';
import { ArrowRight, ArrowUpRight, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function HomePage({ projects }: { projects: Project[] }) {
  const { navigate } = useRouter();
  const featuredProjects = projects.filter((p) => p.is_featured).slice(0, 5);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    setStatus('loading');
    const { error } = await supabase.from('consultations').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="bg-stone-50">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ProtectedImage
            src="https://images.pexels.com/photos/2058172/pexels-photo-2058172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="La Creatión — Luxury Architecture"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/40 to-stone-900/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-6 animate-fade-in-up">
            Kiến trúc · Thiết kế · Kiến tạo
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-stone-100 leading-tight mb-8 animate-fade-in-up animation-delay-100">
            La Creatión
          </h1>
          <p className="text-stone-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
            Nơi nghệ thuật kiến trúc gặp gỡ cuộc sống hiện đại. Chúng tôi kiến tạo
            những không gian vượt thời gian — tinh tế, sang trọng và đầy cảm hứng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
            <button
              onClick={() => navigate('/projects')}
              className="group px-8 py-4 bg-amber-400 text-stone-900 text-sm uppercase tracking-widest font-medium hover:bg-amber-300 transition-all duration-300 flex items-center gap-2"
            >
              Xem dự án
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 border border-stone-300/50 text-stone-100 text-sm uppercase tracking-widest font-medium hover:bg-stone-100/10 transition-all duration-300"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-stone-300/50" />
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-amber-600 text-sm uppercase tracking-[0.3em] mb-4">
            Về chúng tôi
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-stone-800 mb-6 leading-snug">
            Định hình lại không gian sống bằng tư duy thiết kế đột phá
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed max-w-3xl mx-auto">
            La Creatión là studio kiến trúc concept mang đến không gian sáng tạo và thể hiện dấu ấn của chủ đầu tư. 
            Mỗi dự án là một câu chuyện độc bản — nơi hình khối, ánh sáng và vật liệu
            hội tụ để tạo nên những trải nghiệm không gian vô song.
          </p>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 text-sm uppercase tracking-[0.3em] mb-3">
                Dự án tiêu biểu
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-stone-800">
                Những công trình nổi bật
              </h2>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest text-stone-600 hover:text-amber-600 transition-colors group"
            >
              Tất cả dự án
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => navigate(`/project/${project.slug}`)}
                className={`group text-left ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-stone-200 ${
                    idx === 0 ? 'aspect-[16/10] lg:aspect-[16/12]' : 'aspect-[4/3]'
                  }`}
                >
                  <ProtectedImage
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase tracking-widest text-amber-400">
                        {project.category}
                      </span>
                      <span className="text-xs text-stone-300">·</span>
                      <span className="text-xs text-stone-300">{project.scale}</span>
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-stone-100 mb-1 group-hover:text-amber-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-stone-300">{project.location}</p>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={18} className="text-amber-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-stone-600 hover:text-amber-600 transition-colors"
            >
              Tất cả dự án <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section className="py-24 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <ProtectedImage
            src="https://images.pexels.com/photos/6615086/pexels-photo-6615086.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200"
            alt=""
            className="w-full h-full"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4">
              Đăng ký tư vấn
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-stone-100 mb-4">
              Khởi đầu dự án của bạn
            </h2>
            <p className="text-stone-400 leading-relaxed">
              Để lại thông tin, đội ngũ La Creatión sẽ liên hệ tư vấn trong vòng 24 giờ.
            </p>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 size={56} className="text-amber-400 mb-4" />
              <p className="text-xl text-stone-100 font-serif mb-2">Đăng ký thành công!</p>
              <p className="text-stone-400">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
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
      </section>
    </div>
  );
}
