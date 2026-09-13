import { formatConversationStamp } from '../../utils/messageHelpers';
import UnreadBadge from './UnreadBadge';
import OnlineStatus from './OnlineStatus';

export default function ConversationItem({
  conversation,
  active,
  onSelect,
  isModelView,
  unreadCount = 0,
  online,
}) {
  const peer = isModelView
    ? conversation.client
    : { name: 'ASTER' };

  const lastMessage =
    conversation.lastMessage?.text ||
    (conversation.lastMessage?.messageType === 'image'
      ? 'Photo'
      : conversation.lastMessage?.messageType === 'video'
        ? 'Video'
        : 'Start a conversation');

  const initials =
    peer?.name
      ?.split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'A';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 border-b border-white/20 px-4 py-3.5 text-left transition ${
        active
          ? 'bg-pink-500/20 hover:bg-pink-500/30'
          : 'bg-neutral-800 hover:bg-neutral-700'
      }`}
    >
      <span
        className={`absolute bottom-0 left-0 top-0 w-[3px] transition ${
          active
            ? 'bg-pink-500'
            : 'bg-transparent'
        }`}
      />

      <div className="relative shrink-0">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
            active
              ? 'border-pink-500/20 bg-pink-500/10 text-pink-500/80'
              : 'border-white/20 bg-neutral-700 text-white/80'
          }`}
        >
          {initials}
        </div>

        {online && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-[13px] font-semibold ${
              active
                ? 'text-pink-500'
                : 'text-white/80'
            }`}
          >
            {peer?.name}
          </p>

          <span className="shrink-0 text-[9px] text-white/50">
            {conversation.lastMessageAt
              ? formatConversationStamp(
                  conversation.lastMessageAt
                )
              : ''}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={`truncate text-[11px] leading-5 ${
              unreadCount > 0
                ? 'font-medium text-pink-500'
                : 'text-white/50'
            }`}
          >
            {lastMessage}
          </p>

          <UnreadBadge count={unreadCount} />
        </div>

        <div className="mt-1.5">
          <OnlineStatus
            online={online}
            label={online ? 'Online' : 'Offline'}
          />
        </div>
      </div>
    </button>
  );
}