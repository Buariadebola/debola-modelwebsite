import {
  Paperclip,
  SendHorizonal,
  X,
} from 'lucide-react';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

export default function MessageInput({
  onSend,
  onTyping,
  disabled,
  placeholder = 'Type a message...',
}) {
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] =
    useState(null);
  const [previewUrl, setPreviewUrl] =
    useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const isImage =
      file.type.startsWith('image/');

    const isVideo =
      file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert(
        'Please select an image or video.'
      );

      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    event.target.value = '';
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (
    event = null
  ) => {
    event?.preventDefault();

    const trimmedText =
      value.trim();

    if (
      !trimmedText &&
      !selectedFile
    ) {
      return;
    }

    try {
      await onSend(
        trimmedText,
        selectedFile
      );

      setValue('');
      setSelectedFile(null);

      onTyping?.(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(
        'Failed to send message:',
        error
      );
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (
      event.key === 'Enter' &&
      event.shiftKey
    ) {
      onTyping?.(true);
      return;
    }

    onTyping?.(
      Boolean(value.trim())
    );
  };

  const handleChange = (event) => {
    const nextValue =
      event.target.value;

    setValue(nextValue);

    onTyping?.(
      Boolean(nextValue.trim())
    );
  };

  const isImage =
    selectedFile?.type?.startsWith(
      'image/'
    );

  return (
    <div className="border-t border-white/[0.09] bg-[#211c25] px-3 not-sm:pb-5 py-3 sm:px-4">

      {/* FILE PREVIEW */}
      {selectedFile && previewUrl && (
        <div className="mx-auto mb-3 flex max-w-4xl items-center gap-3 border border-pink-700/50 bg-[#2a2430] p-2.5">

          {isImage ? (
            <img
              src={previewUrl}
              alt="Selected"
              className="h-16 w-16 object-cover"
            />
          ) : (
            <video
              src={previewUrl}
              className="h-16 w-16 object-cover"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[#eee8f0]">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#938797]">
              {isImage
                ? 'Image'
                : 'Video'}
            </p>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="flex h-8 w-8 items-center justify-center text-pink-400 transition hover:bg-[#342b3a] hover:text-pink-600"
            aria-label="Remove attachment"
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.7}
            />
          </button>
        </div>
      )}

      {/* INPUT */}
      <div className="mx-auto flex max-w-4xl items-end gap-2 border border-[#51465a] bg-[#2a2430] p-1.5 transition focus-within:border-pink-700/50">

        {/* ATTACHMENT */}
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center text-pink-400 transition hover:bg-[#342b3a] hover:text-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Attach image or video"
        >
          <Paperclip
            className="h-[18px] w-[18px]"
            strokeWidth={1.7}
          />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* TEXTAREA */}
        <textarea
          aria-label="Message input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#eee8f0] outline-none placeholder:text-[#887b8c] disabled:cursor-not-allowed"
          placeholder={placeholder}
        />

        {/* SEND */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            disabled ||
            (!value.trim() &&
              !selectedFile)
          }
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center bg-pink-600 text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizonal
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
}