import { useState, useMemo } from 'react';
import type { Project } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import ProtectedImage from '@/components/ProtectedImage';
import { ArrowUpRight, Star } from 'lucide-react';

const CATEGORIES = ['Tất cả', 'Residential', 'Commercial', 'Hospitality', 'Interior', 'Landscape'];

export default function ProjectsPage({ projects }: { projects: Project[] }) {
  const { navigate } = useRouter();
  const [filter, setFilter] = useState('Tất cả');

  const sortedProjects = useMemo(() => {
    return [...projects].sort(
      (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }, [projects]);

  const highlighted = sortedProjects.filter((p) => p.is_highlighted);

  const filtered = useMemo(() => {
    if (filter === 'Tất cả') return sortedProjects;
    return sortedProjects.filter((p) => p.category === filter);
  }, [sortedProjects, filter]);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Page header */}
      <section className="pt-32 pb-16 bg-stone-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-amber-400 text-sm uppercase tracking-[0.3em] mb-4">
            Portfolio
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-stone-100 mb-4">
            Dự án
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl leading-relaxed">
            Khám phá các công trình kiến trúc và thiết kế nội thất tiêu biểu của
            La Creatión — từ ý tưởng đến hiện thực.
          </p>
        </div>
      </section>

      {/* Highlighted projects */}
      {highlighted.length > 0 && (
        <section className="py-16 bg-stone-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              <h2 className="font-heading text-2xl md:text-3xl text-stone-800">
                Dự án nổi bật
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {highlighted.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="group text-left"
                >
                  <div className="relative overflow-hidden bg-stone-200 aspect-[16/10]">
                    <ProtectedImage
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-stone-900 text-xs uppercase tracking-widest font-medium">
                      Nổi bật
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-widest text-amber-400">
                          {project.category}
                        </span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-stone-300">{project.scale}</span>
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-stone-100 group-hover:text-amber-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={18} className="text-amber-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All projects with filter */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <h2 className="font-heading text-2xl md:text-3xl text-stone-800">
              Tất cả dự án
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-300 ${
                    filter === cat
                      ? 'bg-stone-900 text-amber-400'
                      : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="text-lg">Không có dự án trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="group text-left"
                >
                  <div className="relative overflow-hidden bg-stone-200 aspect-[4/3]">
                    <ProtectedImage
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-widest text-amber-400">
                          {project.category}
                        </span>
                        <span className="text-xs text-stone-300">·</span>
                        <span className="text-xs text-stone-300">{project.scale}</span>
                      </div>
                      <h3 className="font-serif text-lg text-stone-100 group-hover:text-amber-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={16} className="text-amber-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
