import { ArrowLeft, LogOut, MoreHorizontal } from 'lucide-react';
import OnlineStatus from './OnlineStatus';
import { FaUserCircle } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


export default function ChatHeader({
  online,
  onBack,
  modelImage,
  modelName
}) {

const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <header className="flex h-[79px] shrink-0 items-center justify-between border-b border-white/[0.09] bg-neutral-900 px-4 mot-sm:pt-5 text-[#eee8f0] backdrop-blur-xl sm:px-5">

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#51465a] bg-[#2a2430] text-[#c1b5c6] transition hover:border-[#a77abf]/60 hover:bg-[#342b3a] hover:text-white lg:hidden"
            aria-label="Go back"
          >
            <ArrowLeft
              className="h-4 w-4"
              strokeWidth={1.6}
            />
          </button>
        )}

        {/* PROFILE ICON */}
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#5a4d62] bg-[#302638] text-[#c7acd2]">
            {modelImage ? (
            <img
                src={modelImage}
                alt={modelName}
                className="h-full w-full object-cover"
              />
            ) : (
            <FaUserCircle className="text-[25px]" />
            )}
          </div>

          {online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#211c25] bg-emerald-400" />
          )}
        </div>

        {/* CHAT INFO */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#f5f0f6]">
            {modelName}
          </p>

          <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-[#938797]">
            {online ? 'Available now' : 'Currently offline'}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-3">

        <div className="hidden sm:block">
          <OnlineStatus
            online={online}
            label={online ? 'Online' : 'Offline'}
          />
        </div>
        <button
            type="button"
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-b-pink-200/50 bg-[#2a2430] text-pink-200 transition hover:border-white/60 hover:bg-[#342b3a] hover:text-white"
          >
            <LogOut size={17} />
          </button>

      </div>
    </header>
  );
}