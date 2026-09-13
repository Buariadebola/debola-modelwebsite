import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';

export default function ChatWindow({
  messages = [],
  currentUserType,
  typingLabel,
  typingVisible,
  onEditMessage,
  onDeleteMessage,
}) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const element = endOfMessagesRef.current;

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages, typingVisible]);

  if (!messages.length) {
    return (
      <div className="flex h-full flex-col justify-center bg-[#805495]">
        <EmptyChat
          title="Start a conversation"
          description="Send a message to begin your conversation."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-pink-800 scrollbar-track-transparent bg-neutral-800 px-3 py-5 sm:px-5">

      {/* SOFT BACKGROUND ACCENTS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#9b70b5]/[0.04] blur-[130px]" />

        <div className="absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-[#d89bbf]/[0.03] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl space-y-3">

        {messages.map((message) => (
          <motion.div
            key={message._id}
            initial={{
              opacity: 0,
              y: 5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.16,
            }}
          >
            <MessageBubble
              message={message}
              isOwnMessage={
                message.senderType === currentUserType
              }
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          </motion.div>
        ))}

        {typingVisible && (
          <TypingIndicator label={typingLabel} />
        )}

      </div>

      <div ref={endOfMessagesRef} />
    </div>
  );
}