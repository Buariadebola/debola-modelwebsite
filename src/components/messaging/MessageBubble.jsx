import { useState } from 'react';
import { formatClockTime } from '../../utils/messageHelpers';

export default function MessageBubble({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || '');
  const [saving, setSaving] = useState(false);

  const isImage = message.messageType === 'image';
  const isVideo = message.messageType === 'video';

  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();

    if (!trimmedText) return;

    try {
      setSaving(true);

      await onEdit(
        message._id || message.id,
        trimmedText
      );

      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to edit message:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Delete this message?'
    );

    if (!confirmed) return;

    try {
      await onDelete(
        message._id || message.id
      );

      setShowMenu(false);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  return (
    <div
      className={`group flex w-full ${
        isOwnMessage
          ? 'justify-end'
          : 'justify-start'
      }`}
    >
      <div
        className={`
          relative
          max-w-[82%]
          overflow-visible
          border
          shadow-sm
          ${
            isOwnMessage
              ? `
                rounded-xl
                rounded-br-[1px]
                border-pink-900
                bg-pink-500
                text-white
              `
              : `
                rounded-xl
                rounded-bl-[1px]
                border-pink-900
                bg-pink-500
                text-white
              `
          }
        `}
      >
        {/* DELETED MESSAGE */}
        {message.deleted ? (
          <div className="px-3.5 py-2.5">
            <p className="text-[13px] italic text-white/70">
              This message was deleted
            </p>
          </div>
        ) : (
          <>
            {/* THREE DOT MENU */}
            {isOwnMessage && (
              <div
                className="
                  absolute
                  right-1
                  top-1
                  z-30
                  opacity-0
                  transition-opacity
                  duration-150
                  group-hover:opacity-100
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowMenu((current) => !current)
                  }
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-black/20
                    text-[#e5d8e9]
                    backdrop-blur-sm
                    transition
                    hover:bg-black/35
                    hover:text-white
                  "
                  aria-label="Message options"
                >
                  <span className="text-[17px] leading-none">
                    ⋮
                  </span>
                </button>

                {/* MENU */}
                {showMenu && (
                  <div
                    className="
                      absolute
                      right-0
                      top-8
                      z-50
                      w-28
                      overflow-hidden
                      rounded-lg
                      border
                      border-[#51465a]
                      bg-[#2a2430]
                      shadow-xl
                      shadow-black/40
                    "
                  >
                    {message.messageType === 'text' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditText(
                            message.text || ''
                          );
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="
                          block
                          w-full
                          px-3
                          py-2.5
                          text-left
                          text-xs
                          text-[#ddd2e1]
                          transition
                          hover:bg-[#342b3a]
                          hover:text-white
                        "
                      >
                        Edit
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleDelete}
                      className="
                        block
                        w-full
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        text-red-400
                        transition
                        hover:bg-red-500/10
                      "
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MEDIA */}
            {(isImage || isVideo) &&
              message.mediaUrl && (
                <div className="overflow-hidden rounded-t-[17px] bg-[#17131a]">
                  {isImage ? (
                    <img
                      src={message.mediaUrl}
                      alt="Shared media"
                      className="
                        block
                        max-h-[420px]
                        w-full
                        max-w-[420px]
                        cursor-pointer
                        object-cover
                      "
                      onClick={() =>
                        window.open(
                          message.mediaUrl,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                    />
                  ) : (
                    <video
                      src={message.mediaUrl}
                      controls
                      playsInline
                      className="
                        block
                        max-h-[420px]
                        w-full
                        max-w-[480px]
                      "
                    />
                  )}
                </div>
              )}

            {/* EDITING */}
            {isEditing ? (
              <div className="min-w-[220px] p-3">
                <textarea
                  value={editText}
                  onChange={(event) =>
                    setEditText(event.target.value)
                  }
                  autoFocus
                  rows={3}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-[#5a4d62]
                    bg-[#211c25]
                    px-3
                    py-2
                    text-[14px]
                    text-[#eee8f0]
                    outline-none
                    placeholder:text-[#887b8c]
                    focus:border-[#a77abf]
                  "
                />

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(
                        message.text || ''
                      );
                    }}
                    disabled={saving}
                    className="
                      px-3
                      py-1.5
                      text-xs
                      text-[#a99bac]
                      transition
                      hover:text-white
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={
                      saving ||
                      !editText.trim()
                    }
                    className="
                      rounded-md
                      border
                      border-[#a77abf]
                      bg-[#805495]
                      px-3
                      py-1.5
                      text-xs
                      text-white
                      transition
                      hover:bg-[#9164a6]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              message.text && (
                <p
                  className={`
                    whitespace-pre-wrap
                    break-words
                    px-3.5
                    pb-1
                    pt-2.5
                    text-[14px]
                    leading-[1.45]
                    ${
                      isOwnMessage
                        ? 'pr-9'
                        : 'pr-3.5'
                    }
                  `}
                >
                  {message.text}
                </p>
              )
            )}

            {/* TIMESTAMP */}
            <div
              className={`
                flex
                items-center
                justify-end
                gap-1
                px-3.5
                pb-2
                pt-0.5
                text-[9px]
                ${
                  isOwnMessage
                    ? 'text-[#e0c9e6]'
                    : 'text-white'
                }
              `}
            >
              {message.edited && (
                <span>Edited</span>
              )}

              <span>
                {formatClockTime(
                  message.createdAt
                )}
              </span>

              {isOwnMessage && (
                <span
                  aria-label={
                    message.read
                      ? 'Message read'
                      : 'Message sent'
                  }
                  className="tracking-[-2px]"
                >
                  {message.read
                    ? '✓✓'
                    : '✓'}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}