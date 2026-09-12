import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, LogOut } from 'lucide-react';

import ChatHeader from '../../components/messaging/ChatHeader';
import ChatWindow from '../../components/messaging/ChatWindow';
import MessageInput from '../../components/messaging/MessageInput';

import { useAuth } from '../../context/AuthContext';
import { useMessaging } from '../../hooks/useMessaging';

export default function ClientMessages() {
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
  socketConnected,
} = useMessaging();

  const currentConversation = useMemo(() => {
    return conversations[0] || null;
  }, [conversations]);

  useEffect(() => {
    if (
      user?.type === 'client' &&
      currentConversation &&
      activeConversationId !== currentConversation._id
    ) {
      selectConversation(currentConversation);
    }
  }, [
    currentConversation,
    activeConversationId,
    user?.type,
    selectConversation,
  ]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-pink-800" />
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-pink-900">
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.type !== 'client') {
    return <Navigate to="/login" replace />;
  }

  const conversationMessages = activeConversationId
    ? messagesByConversation[activeConversationId] || []
    : [];

  const conversationTyping = activeConversationId
    ? typingUsers[activeConversationId]
    : null;

  const modelOnline = onlineUsers['model:admin'] ?? false;

  const handleSend = async (text, file) => {
    if (!activeConversationId) return;

    await sendMessage(activeConversationId, text, file);
  };

  const handleTyping = (isActive) => {
    if (!activeConversationId) return;

    if (isActive) {
      startTyping(activeConversationId);
    } else {
      stopTyping(activeConversationId);
    }
  };

  return (
    <main className="min-h-screen bg-[#805495]">

      {/* Chat application */}
      <section className="mx-auto flex h-screen min-h-[560px] w-screen flex-col overflow-hidden bg-[#805495]">
        {/* Header */}
        <div className="shrink-0 border-b border-[#e8e3e9] bg-white">
          <ChatHeader
            modelName={currentConversation?.model?.name || 'Model'}
            modelImage={currentConversation?.model?.profileImage || null}
            online={modelOnline}
            onBack={() => window.history.back()}
          />
        </div>

        {/* Loading */}
        {loading || loadingMessages ? (
          <div className="flex h-full items-center justify-center bg-pink-300 text-pink-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin border border-pink-600 border-t-transparent" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-pink-800">
            Loading Conversation
          </p>
        </div>
      </div>
        ) : activeConversationId ? (
          <>
            {/* Messages */}
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#f8f7f9]">
              <ChatWindow
                messages={conversationMessages}
                currentUserType="client"
                typingVisible={Boolean(conversationTyping)}
                typingLabel={`${currentConversation?.model?.name || 'Model'} is typing...`}
                onEditMessage={editMessage}
                onDeleteMessage={deleteMessage}
              />
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-[#e7e2e9] bg-white">
              <MessageInput
                onSend={handleSend}
                onTyping={handleTyping}
                disabled={sending || !activeConversationId}
                placeholder="Type a message..."
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-[#f8f7f9]">
            <div className="px-6 text-center">

              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#a098a8]">
                Private messages
              </p>

              <h2 className="mt-2 text-xl font-semibold text-[#302a34]">
                Your conversation
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#918995]">
                Your private conversation with Model will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}