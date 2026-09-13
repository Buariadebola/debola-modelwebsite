export default function UnreadBadge({ count = 0 }) {
  if (!count) return null;

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}
