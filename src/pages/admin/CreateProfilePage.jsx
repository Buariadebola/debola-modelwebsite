import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';

const initialForm = {
  name: '',
  username: '',
  bio: '',
  location: '',
  categories: '',
  height: '',
  experience: '',
  availability: 'Available',
};

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('username', form.username);
      payload.append('bio', form.bio);
      payload.append('location', form.location);

      const categories = form.categories
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean);

      categories.forEach((category) => {
        payload.append('categories', category);
      });

      payload.append('height', form.height);
      payload.append('experience', form.experience);
      payload.append('availability', form.availability);

      if (selectedImage) {
        payload.append('profileImage', selectedImage);
      }

      await api.post('/admin/models', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/admin/profiles', { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Unable to create the profile right now.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf2ff_35%,#f6ecff_100%)] px-4 py-8 text-[#311a32] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0dff1] bg-white text-[#5a3658] transition hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} />
            </Link>

            <div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.28em] text-[#9b7a90]">
                Studio
              </p>
              <h1 className="font-serif text-4xl tracking-tight text-[#321b38]">
                Create profile
              </h1>
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f0dff1] bg-white text-[#5a3658] shadow-sm">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-[#f0dff1] bg-white/80 shadow-[0_22px_60px_rgba(168,104,185,0.09)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.5fr]">
            <aside className="bg-[linear-gradient(135deg,#341a32_0%,#4c2449_35%,#6a2d66_100%)] p-6 text-white sm:p-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/60">
                Profile setup
              </p>
              <h2 className="mt-4 font-serif text-3xl leading-tight">
                Build the model identity.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Add the foundational details that define the public portfolio and the editorial presence across the platform.
              </p>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#311a32]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                      Editorial brief
                    </p>
                    <p className="mt-1 text-sm text-white/80">
                      Premium, polished, and conversion-ready.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <div className="p-6 sm:p-8">
              <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="Amara Johnson"
                    required
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Username</span>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="amara_j"
                    required
                  />
                </label>

                <label className="md:col-span-2 space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Bio</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="Fashion, commercial, and lifestyle model based in Lagos..."
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Location</span>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="Lagos, Nigeria"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Categories</span>
                  <input
                    name="categories"
                    value={form.categories}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="Fashion, Commercial, Lifestyle"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Height</span>
                  <input
                    name="height"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder={'5\'9"'}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Experience</span>
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                    placeholder="5 years"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5d405d]">Availability</span>
                  <select
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#efd9ee] bg-[#fff9fc] px-4 py-3 text-sm text-[#311a32] outline-none transition focus:border-[#d96bb4]"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Open for collaborations">Open for collaborations</option>
                  </select>
                </label>

                <div className="md:col-span-2 rounded-[24px] border border-dashed border-[#f0dff1] bg-[#fff9fc] p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[#efd9ee] bg-white px-4 py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] text-white">
                      <ImagePlus size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#5d405d]">
                        {selectedImage ? selectedImage.name : 'Upload profile image'}
                      </p>
                      <p className="mt-1 text-xs text-[#866a87]">
                        JPG, PNG, WEBP or GIF up to 10MB.
                      </p>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                {error ? (
                  <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <Link
                    to="/admin"
                    className="rounded-full border border-[#f0dff1] bg-white px-5 py-2.5 text-sm font-medium text-[#5a3658] transition hover:bg-[#fff6fb]"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(168,104,185,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
