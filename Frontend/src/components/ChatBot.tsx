import { useNavigate } from 'react-router-dom';

export default function ChatBot() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-8 right-8 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-white/[0.18] via-white/[0.12] to-white/[0.06] backdrop-blur-3xl border border-white/[0.22] rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.37),0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_15px_rgba(255,255,255,0.08),inset_0_2px_0_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5),0_0_0_1px_rgba(255,255,255,0.2),inset_0_0_20px_rgba(255,255,255,0.12)] transition-all duration-500 flex items-center justify-center z-[9999] hover:scale-110 overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/25 before:via-transparent before:to-transparent before:opacity-60 before:-z-10 after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/[0.2] after:to-transparent after:animate-shimmer"
      aria-label="Open chat"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    </button>
  );
}
