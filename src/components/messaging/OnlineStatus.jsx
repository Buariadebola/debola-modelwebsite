export default function OnlineStatus({
  online,
  label = 'Online',
}) {
  return (
    <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/70">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          online
            ? 'bg-pink-500 shadow-[0_0_8px_rgba(52,211,153,0.45)]'
            : 'bg-white/70'
        }`}
        aria-label={online ? 'Online' : 'Offline'}
      />

      <span>
        {online ? label : 'Offline'}
      </span>
    </div>
  );
}