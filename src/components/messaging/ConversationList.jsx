import ConversationItem from './ConversationItem';
import EmptyChat from './EmptyChat';

export default function ConversationList({
  conversations = [],
  activeConversationId,
  onSelect,
  unreadCounts = {},
  onlineUsers = {},
  isModelView,
}) {
  if (!conversations.length) {
    return (
      <aside className="flex h-full flex-col bg-white">
        <div className="border-b border-[#e8e3e9] px-4 py-4">
          <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#a098a8]">
            Inbox
          </p>

          <h2 className="mt-1 text-lg font-semibold text-[#302a34]">
            Messages
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <EmptyChat
            title="No conversations"
            description="Client conversations will appear here."
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-[280px] flex-col bg-white">
      <div className="shrink-0 border-b border-[#e8e3e9] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#a098a8]">
              Private inbox
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-none text-[#302a34]">
              Messages
            </h2>
          </div>

          <span className="flex h-7 min-w-7 items-center justify-center border border-[#e4dfe7] bg-[#faf8fb] px-2 text-[9px] text-[#756d7b]">
            {conversations.length}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const conversationId = conversation._id;

          const peerKey = isModelView
            ? `client:${
                conversation.client?._id ||
                conversation.client
              }`
            : 'model:admin';

          const peerOnline =
            onlineUsers[peerKey] ?? false;

          return (
            <ConversationItem
              key={conversationId}
              conversation={conversation}
              active={
                activeConversationId === conversationId
              }
              onSelect={() => onSelect(conversation)}
              unreadCount={
                unreadCounts[conversationId] || 0
              }
              online={peerOnline}
              isModelView={isModelView}
            />
          );
        })}
      </div>

      <div className="hidden shrink-0 border-t border-[#e8e3e9] px-4 py-3 xl:block">
        <p className="text-[8px] uppercase tracking-[0.2em] text-[#a098a8]">
          ASTER / Private Clients
        </p>
      </div>
    </aside>
  );
}
