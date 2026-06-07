export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z"
                fill="white"
                opacity="0.8"
              />
              <path d="M5 5h2v2H5zM11 5h2v2h-2zM5 11h2v2H5z" fill="white" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">
            Second Brain
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
