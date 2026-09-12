import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Plus } from 'lucide-react';
import { useModels } from '../../context/ModelContext';

export default function AdminProfilesPage() {
  const { models } = useModels();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf2ff_35%,#f6ecff_100%)] px-4 py-8 text-[#311a32] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#9b7a90]">
              Studio profiles
            </p>
            <h1 className="font-serif text-4xl tracking-tight text-[#321b38]">
              Select a profile
            </h1>
          </div>

          <Link
            to="/admin/create-profile"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(168,104,185,0.28)] transition hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Create profile
          </Link>
        </div>

        {models.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[#f0dff1] bg-white/80 p-10 text-center text-[#704d72] shadow-[0_18px_40px_rgba(168,104,185,0.06)]">
            No profiles yet. Create your first model profile to start building the studio.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => (
              <div
                key={model.username}
                className="overflow-hidden rounded-[28px] border border-[#f0dff1] bg-white shadow-[0_18px_40px_rgba(168,104,185,0.08)]"
              >
                <div className="relative h-52 overflow-hidden bg-[#f4d9ee]">
                  <img
                    src={
                      model.profileImage ||
                      model.posts?.[0]?.image ||
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={model.name}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2d1634]/80 to-transparent p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {model.username}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-white">
                      {model.name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2 text-sm text-[#7a5d7a]">
                    <Camera size={15} className="text-[#d96bb4]" />
                    {model.posts?.length || 0} posts
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-[#5d405d]">
                    {model.bio || 'No bio available yet.'}
                  </p>

                  <Link
                    to={`/admin/models/${model.username}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#38213d] transition hover:text-[#7c3aed]"
                  >
                    Open profile
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
