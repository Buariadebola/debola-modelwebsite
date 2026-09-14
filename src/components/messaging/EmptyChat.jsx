export default function EmptyChat({
  title = 'Select a conversation',
  description = 'Choose a conversation to start messaging.',
}) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-pink-950 p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-pink-600 bg-pink-950">
          <span className="h-2 w-2 rounded-full bg-pink-600 shadow-[0_0_14px_rgba(128,84,149,0.55)]" />
        </div>

        <h3 className="text-base font-medium text-pink-100">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-pink-200">
          {description}
        </p>
      </div>
    </div>
  );
}