import { useState, useEffect, useCallback } from 'react';
import { supabase, type Project, type Consultation } from '@/lib/supabase';
import ProtectedImage from '@/components/ProtectedImage';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Eye,
  Mail,
  Phone,
  LogOut,
  Lock,
} from 'lucide-react';

type FormState = {
  title: string;
  slug: string;
  category: string;
  scale: string;
  location: string;
  description: string;
  image_url: string;
  gallery_urls: string[];
  is_highlighted: boolean;
  is_featured: boolean;
};

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  category: 'Residential',
  scale: '',
  location: '',
  description: '',
  image_url: '',
  gallery_urls: [],
  is_highlighted: false,
  is_featured: false,
};

const CATEGORIES = ['Residential', 'Commercial', 'Hospitality', 'Interior', 'Landscape'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [tab, setTab] = useState<'projects' | 'consultations'>('projects');
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(!!data.session);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(!!sess);
    });
    return () => listener.subscription.unsubscribe();
  }, [checkSession]);

  const loadData = useCallback(async () => {
    const [{ data: projData }, { data: conData }] = await Promise.all([
      supabase.from('projects').select('*').order('published_at', { ascending: false }),
      supabase.from('consultations').select('*').order('created_at', { ascending: false }),
    ]);
    if (projData) setProjects(projData as Project[]);
    if (conData) setConsultations(conData as Consultation[]);
  }, []);

  useEffect(() => {
    if (session) loadData();
  }, [session, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(false);
    setProjects([]);
    setConsultations([]);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setAuthLoading(false);
    if (error) setAuthError(error.message);
    else setAuthError('Tài khoản đã tạo. Hãy đăng nhập.');
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      slug: project.slug,
      category: project.category,
      scale: project.scale,
      location: project.location ?? '',
      description: project.description ?? '',
      image_url: project.image_url,
      gallery_urls: project.gallery_urls ?? [],
      is_highlighted: project.is_highlighted,
      is_featured: project.is_featured,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.slug.trim() || !form.image_url.trim()) {
      setFormError('Vui lòng điền tiêu đề, slug và ảnh chính.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      category: form.category,
      scale: form.scale,
      location: form.location || null,
      description: form.description || null,
      image_url: form.image_url,
      gallery_urls: form.gallery_urls,
      is_highlighted: form.is_highlighted,
      is_featured: form.is_featured,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('projects').insert(payload));
    }

    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    setShowForm(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa dự án này? Hành động không thể hoàn tác.')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert('Lỗi: ' + error.message);
      return;
    }
    await loadData();
  };

  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(false);
    if (error) {
      setFormError('Upload lỗi: ' + error.message);
      return null;
    }
    const { data } = supabase.storage.from('projects').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, 'main');
    if (url) setForm((f) => ({ ...f, image_url: url }));
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, 'gallery');
      if (url) urls.push(url);
    }
    setForm((f) => ({ ...f, gallery_urls: [...f.gallery_urls, ...urls] }));
  };

  const removeGalleryImage = (idx: number) => {
    setForm((f) => ({
      ...f,
      gallery_urls: f.gallery_urls.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <Loader2 size={32} className="text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Lock size={40} className="text-amber-400 mx-auto mb-4" />
            <h1 className="font-heading text-3xl text-stone-100 mb-2">Quản trị</h1>
            <p className="text-stone-400 text-sm">Đăng nhập để quản lý dự án</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5 bg-stone-800/50 p-8 border border-stone-700">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-amber-400 text-stone-900 text-sm uppercase tracking-widest font-medium hover:bg-amber-300 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : 'Đăng nhập'}
            </button>
            <button
              type="button"
              onClick={handleSignup}
              disabled={authLoading}
              className="w-full py-3 border border-stone-600 text-stone-300 text-sm uppercase tracking-widest font-medium hover:border-amber-400 hover:text-amber-400 transition-colors duration-300 disabled:opacity-50"
            >
              Tạo tài khoản
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Admin header */}
      <header className="bg-stone-900 text-stone-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl text-amber-400">La Creatión</span>
            <span className="text-stone-500">|</span>
            <span className="text-sm uppercase tracking-widest text-stone-400">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-stone-400 hover:text-amber-400 transition-colors"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab('projects')}
            className={`px-6 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
              tab === 'projects'
                ? 'bg-stone-900 text-amber-400'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Dự án ({projects.length})
          </button>
          <button
            onClick={() => setTab('consultations')}
            className={`px-6 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
              tab === 'consultations'
                ? 'bg-stone-900 text-amber-400'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Tư vấn ({consultations.length})
          </button>
        </div>

        {tab === 'projects' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-stone-800">Quản lý dự án</h2>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-amber-400 text-sm uppercase tracking-widest font-medium hover:bg-amber-400 hover:text-stone-900 transition-all duration-300"
              >
                <Plus size={18} /> Thêm dự án
              </button>
            </div>

            {/* Project list */}
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 bg-white p-4 border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  <div className="w-20 h-20 shrink-0 bg-stone-100 overflow-hidden">
                    <ProtectedImage
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg text-stone-800 truncate">{project.title}</h3>
                      {project.is_featured && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs uppercase tracking-widest">
                          Trang chủ
                        </span>
                      )}
                      {project.is_highlighted && (
                        <span className="px-2 py-0.5 bg-stone-200 text-stone-600 text-xs uppercase tracking-widest">
                          Nổi bật
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500">
                      {project.category} · {project.scale}
                      {project.location ? ` · ${project.location}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(project)}
                      className="p-2.5 text-stone-500 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
                      aria-label="Sửa"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                      aria-label="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Chưa có dự án nào. Nhấn "Thêm dự án" để bắt đầu.</p>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'consultations' && (
          <>
            <h2 className="font-heading text-2xl text-stone-800 mb-6">Yêu cầu tư vấn</h2>
            <div className="grid grid-cols-1 gap-4">
              {consultations.map((c) => (
                <div key={c.id} className="bg-white p-5 border border-stone-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-stone-800 mb-2">{c.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                          <Mail size={14} /> {c.email}
                        </a>
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
                          <Phone size={14} /> {c.phone}
                        </a>
  
                      </div>
                      {c.message && (
                        <p className="text-sm text-stone-600 mt-3 leading-relaxed">{c.message}</p>
                      )}
                      <p className="text-xs text-stone-400 mt-3">
                        {new Date(c.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm('Xóa yêu cầu này?')) return;
                        await supabase.from('consultations').delete().eq('id', c.id);
                        await loadData();
                      }}
                      className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 shrink-0"
                      aria-label="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {consultations.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                  <p>Chưa có yêu cầu tư vấn nào.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Project form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-3xl bg-stone-50 my-8">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="font-heading text-2xl text-stone-800">
                {editing ? 'Sửa dự án' : 'Thêm dự án mới'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-all duration-300"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        title: e.target.value,
                        slug: editing ? f.slug : slugify(e.target.value),
                      }));
                    }}
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Villa Bảo Châu"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="villa-bao-chau"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Loại hình
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Quy mô
                  </label>
                  <input
                    type="text"
                    value={form.scale}
                    onChange={(e) => setForm((f) => ({ ...f, scale: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="350m²"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Đà Nẵng"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-stone-800 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                  placeholder="Mô tả dự án..."
                />
              </div>

              {/* Main image upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Ảnh chính *
                </label>
                {form.image_url ? (
                  <div className="relative w-full max-w-sm aspect-[4/3] bg-stone-200 overflow-hidden group">
                    <ProtectedImage src={form.image_url} alt="Main" className="w-full h-full" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                      className="absolute top-2 right-2 p-2 bg-stone-900/70 text-white hover:bg-red-600 transition-colors rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] border-2 border-dashed border-stone-300 hover:border-amber-400 cursor-pointer transition-colors bg-white">
                    {uploading ? (
                      <Loader2 size={28} className="text-amber-500 animate-spin" />
                    ) : (
                      <>
                        <Upload size={28} className="text-stone-400 mb-2" />
                        <span className="text-sm text-stone-500">Click để tải ảnh lên</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Gallery upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Thư viện ảnh
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {form.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative aspect-[4/3] bg-stone-200 overflow-hidden group">
                      <ProtectedImage src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1.5 bg-stone-900/70 text-white hover:bg-red-600 transition-colors rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed border-stone-300 hover:border-amber-400 cursor-pointer transition-colors bg-white">
                    {uploading ? (
                      <Loader2 size={22} className="text-amber-500 animate-spin" />
                    ) : (
                      <>
                        <Plus size={22} className="text-stone-400 mb-1" />
                        <span className="text-xs text-stone-500">Thêm ảnh</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="flex items-center gap-1.5 text-sm text-stone-700">
                    <Eye size={16} /> Hiển thị trên Trang chủ
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_highlighted}
                    onChange={(e) => setForm((f) => ({ ...f, is_highlighted: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="flex items-center gap-1.5 text-sm text-stone-700">
                    <Star size={16} /> Đánh dấu nổi bật
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 bg-stone-900 text-amber-400 text-sm uppercase tracking-widest font-medium hover:bg-amber-400 hover:text-stone-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : editing ? 'Lưu thay đổi' : 'Tạo dự án'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-stone-300 text-stone-600 text-sm uppercase tracking-widest font-medium hover:border-stone-400 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
