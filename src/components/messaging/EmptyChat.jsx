export default function EmptyChat({
  title = 'Select a conversation',
  description = 'Choose a conversation to start messaging.',
}) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-[#211c25] p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-[#51465a] bg-[#2a2430]">
          <span className="h-2 w-2 rounded-full bg-[#805495] shadow-[0_0_14px_rgba(128,84,149,0.55)]" />
        </div>

        <h3 className="text-base font-medium text-[#f5f0f6]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#938797]">
          {description}
        </p>
      </div>
    </div>
  );
}