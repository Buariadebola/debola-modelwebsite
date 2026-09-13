import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, LogOut } from 'lucide-react';

import ChatHeader from '../../components/messaging/ChatHeader';
import ChatWindow from '../../components/messaging/ChatWindow';
import ConversationList from '../../components/messaging/ConversationList';
import MessageInput from '../../components/messaging/MessageInput';

import { useAuth } from '../../context/AuthContext';
import { useMessaging } from '../../hooks/useMessaging';

export default function AdminMessages() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

  const {
    conversations,
    activeConversationId,
    messagesByConversation,
    loading,
    loadingMessages,
    sending,
    sendMessage,
    editMessage,
    deleteMessage,
    selectConversation,
    startTyping,
    stopTyping,
    typingUsers,
    onlineUsers,
    unreadCounts,
    socketConnected,
  } = useMessaging();

  useEffect(() => {
    if (
      user?.type === 'model' &&
      conversations.length &&
      !activeConversationId
    ) {
      selectConversation(conversations[0]);
    }
  }, [
    conversations,
    activeConversationId,
    user?.type,
    selectConversation,
  ]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation._id === activeConversationId
      ) ||
      conversations[0] ||
      null,
    [conversations, activeConversationId]
  );

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f8]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#8064a2]" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9d96a3]">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.type !== 'model') {
    return <Navigate to="/admin/login" replace />;
  }

  const selectedMessages = selectedConversation
    ? messagesByConversation[selectedConversation._id] || []
    : [];

  const selectedTyping = selectedConversation
    ? typingUsers[selectedConversation._id]
    : null;

  const selectedPeerKey = selectedConversation?.client?._id
    ? `client:${selectedConversation.client._id}`
    : null;

  const selectedPeerOnline = selectedPeerKey
    ? onlineUsers[selectedPeerKey] ?? false
    : false;

  const handleSend = async (text, file) => {
    if (!selectedConversation) return;

    await sendMessage(selectedConversation._id, text, file);
  };

  const handleTyping = (isActive) => {
    if (!selectedConversation) return;

    if (isActive) {
      startTyping(selectedConversation._id);
    } else {
      stopTyping(selectedConversation._id);
    }
  };

  return (
    <main className="min-h-screen bg-[#805495]">
      {/* Messaging app */}
      <section className="mx-auto flex h-screen min-h-[560px] w-screen max-w-[1350px] overflow-hidden border border-[#e5e0e7] bg-white shadow-[0_12px_45px_rgba(54,42,62,0.06)]">
        {/* Conversation sidebar */}
        <aside className="hidden w-[300px] shrink-0 border-r border-white/20 bg-neutral-900 lg:flex lg:flex-col xl:w-[340px]">
          <div className="border-b border-white/20 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-pink-200">
                  Inbox
                </p>

                <h2 className="mt-1 text-lg font-semibold text-pink-100">
                  Clients
                </h2>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center border border-pink-500/30 bg-pink-500/20 px-2 text-[10px] text-pink-500">
                {conversations.length}
              </span>
            </div>
          </div>

          <div className="min-h-0 flex-1">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={selectConversation}
              unreadCounts={unreadCounts}
              onlineUsers={onlineUsers}
              isModelView
            />
          </div>
        </aside>

        {/* Mobile conversation rail */}
        <div className="flex w-[72px] shrink-0 border-r border-[#e5e0e7] bg-white lg:hidden">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={selectConversation}
            unreadCounts={unreadCounts}
            onlineUsers={onlineUsers}
            isModelView
          />
        </div>

        {/* Chat */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#f8f7f9]">
          {selectedConversation ? (
            <>
              <div className="shrink-0 border-b border-[#e5e0e7] bg-white">
                <ChatHeader
                  title={selectedConversation.client?.name || 'Client'}
                  subtitle={
                    socketConnected
                      ? selectedPeerOnline
                        ? 'Online'
                        : 'Available for messages'
                      : 'Connecting...'
                  }
                  online={selectedPeerOnline}
                  onBack={() => {}}
                />
              </div>

              {loading || loadingMessages ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#8064a2]" />

                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9d96a3]">
                      Loading conversation
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <ChatWindow
                      messages={selectedMessages}
                      currentUserType="model"
                      typingVisible={Boolean(selectedTyping)}
                      typingLabel={`${selectedConversation.client?.name || 'Client'} is typing...`}
                      onEditMessage={editMessage}
                      onDeleteMessage={deleteMessage}
                    />
                  </div>

                  <div className="shrink-0 border-t border-[#e5e0e7] bg-white">
                    <MessageInput
                      onSend={handleSend}
                      onTyping={handleTyping}
                      disabled={sending || !selectedConversation}
                      placeholder="Type a message..."
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="px-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-[#e4dce9] bg-white text-[#8064a2]">
                  <span className="text-lg font-semibold">A</span>
                </div>

                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#a098a8]">
                  Private messages
                </p>

                <h2 className="mt-2 text-xl font-semibold text-[#302a34]">
                  Select a conversation
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#918995]">
                  Choose a client from your inbox to view your correspondence.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto mt-3 flex w-full max-w-[1350px] justify-between px-1">
        <p className="text-[8px] uppercase tracking-[0.2em] text-[#a29aa7]">
          ASTER / PRIVATE CLIENTS
        </p>

        <p className="hidden text-[8px] uppercase tracking-[0.2em] text-[#a29aa7] sm:block">
          Confidential correspondence
        </p>
      </div>
    </main>
  );
}