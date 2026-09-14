import type { Project } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import ProtectedImage from '@/components/ProtectedImage';
import { ArrowLeft, MapPin, Maximize2, Calendar, Layers } from 'lucide-react';

export default function ProjectDetailPage({
  project,
  allProjects,
}: {
  project: Project;
  allProjects: Project[];
}) {
  const { navigate } = useRouter();

  const related = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <ProtectedImage
          src={project.image_url}
          alt={project.title}
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-stone-900/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-sm text-stone-300 hover:text-amber-400 transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Quay lại dự án
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-amber-400 text-stone-900 text-xs uppercase tracking-widest font-medium">
                {project.category}
              </span>
              {project.is_highlighted && (
                <span className="px-3 py-1 bg-stone-800/80 text-amber-400 text-xs uppercase tracking-widest">
                  Nổi bật
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-stone-100 mb-2">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Project info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-stone-800 mb-6">
                Tổng quan dự án
              </h2>
              <p className="text-stone-600 leading-relaxed text-lg mb-8">
                {project.description}
              </p>

              {/* Gallery */}
              {project.gallery_urls.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl text-stone-800 mb-6">
                    Hình ảnh dự án
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProtectedImage
                      src={project.image_url}
                      alt={`${project.title} — main`}
                      className="aspect-[4/3] bg-stone-200"
                    />
                    {project.gallery_urls.map((url, idx) => (
                      <ProtectedImage
                        key={idx}
                        src={url}
                        alt={`${project.title} — ${idx + 2}`}
                        className="aspect-[4/3] bg-stone-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-8 shadow-sm border border-stone-100 sticky top-28">
                <h3 className="text-sm uppercase tracking-widest text-amber-600 mb-6">
                  Thông tin dự án
                </h3>
                <dl className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Layers size={20} className="text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                        Loại hình
                      </dt>
                      <dd className="text-stone-700">{project.category}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Maximize2 size={20} className="text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                        Quy mô
                      </dt>
                      <dd className="text-stone-700">{project.scale}</dd>
                    </div>
                  </div>
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-stone-400 mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                          Địa điểm
                        </dt>
                        <dd className="text-stone-700">{project.location}</dd>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                        Ngày đăng
                      </dt>
                      <dd className="text-stone-700">{formatDate(project.published_at)}</dd>
                    </div>
                  </div>
                </dl>

                <button
                  onClick={() => navigate('/contact')}
                  className="w-full mt-8 py-3 bg-stone-900 text-amber-400 text-sm uppercase tracking-widest font-medium hover:bg-amber-400 hover:text-stone-900 transition-all duration-300"
                >
                  Tư vấn dự án tương tự
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-16 bg-stone-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-2xl md:text-3xl text-stone-800 mb-8">
              Dự án cùng loại hình
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/project/${p.slug}`)}
                  className="group text-left"
                >
                  <div className="relative overflow-hidden bg-stone-200 aspect-[4/3]">
                    <ProtectedImage
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-serif text-lg text-stone-100 group-hover:text-amber-400 transition-colors duration-300">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-300">{p.scale}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
