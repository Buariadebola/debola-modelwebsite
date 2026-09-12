export default function OnlineStatus({
  online,
  label = 'Online',
}) {
  return (
    <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#938797]">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          online
            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]'
            : 'bg-[#665b6b]'
        }`}
        aria-label={online ? 'Online' : 'Offline'}
      />

      <span>
        {online ? label : 'Offline'}
      </span>
    </div>
  );
}