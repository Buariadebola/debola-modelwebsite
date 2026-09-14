import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ImagePlus,
  LogOut,
  MessageSquareText,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const cards = [
  {
    title: 'Select Profile',
    description: 'Open an existing model profile and manage the portfolio.',
    path: '/admin/profiles',
    accent: 'from-[#f472b6] via-[#d946ef] to-[#8b5cf6]',
    icon: UserRound,
  },
  {
    title: 'Create Profile',
    description: 'Create a new model page with bio, media, and editorial details.',
    path: '/admin/create-profile',
    accent: 'from-[#ec4899] via-[#a855f7] to-[#7c3aed]',
    icon: ImagePlus,
  },
  {
    title: 'Messages',
    description: 'Respond to private client conversations and manage inboxes.',
    path: '/admin/messages',
    accent: 'from-[#f9a8d4] via-[#c084fc] to-[#8b5cf6]',
    icon: MessageSquareText,
  },
];

const AdminPage = () => {

  const { logout } = useAuth();
  
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf2ff_35%,#f6ecff_100%)] px-4 py-8 text-[#311a32] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[32px] border border-[#f0dff1] bg-white/80 shadow-[0_25px_80px_rgba(168,104,185,0.12)] backdrop-blur-sm">
          <div className="grid gap-6 px-6 py-7 md:grid-cols-[1.4fr_0.8fr] md:px-8 md:py-8">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9b7a90]">
                Studio dashboard
              </p>

              <h1 className="font-serif text-4xl tracking-tight text-[#321b38] sm:text-5xl">
                Aster editorial control
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6d4a68]">
                Manage model profiles, create new portfolios, and respond to client conversations from one elegant studio workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[#9b7a90]">
              Quick access
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-[#f0dff1] bg-white px-4 py-2 text-sm font-medium text-[#5a3658] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#fff6fb]"
          >
            Logout
            <LogOut size={16} />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(({ title, description, path, accent, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="group relative overflow-hidden rounded-[28px] border border-[#f0dff1] bg-white/90 p-6 shadow-[0_18px_40px_rgba(168,104,185,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(168,104,185,0.12)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />

              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] text-white">
                <Icon size={18} />
              </div>

              <h2 className="mb-2 text-2xl font-semibold text-[#311a32]">
                {title}
              </h2>

              <p className="mb-5 text-sm leading-6 text-[#785e77]">
                {description}
              </p>

              <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4d2d49]">
                Open page
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
