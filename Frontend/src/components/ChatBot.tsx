import { useNavigate } from 'react-router-dom';
import GlassSurface from './GlassSurface';

export default function ChatBot() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-8 right-8 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 z-[9999] hover:scale-110 transition-all duration-500"
      aria-label="Open chat"
    >
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={9999}
        brightness={55}
        opacity={0.9}
        blur={12}
        displace={0}
        backgroundOpacity={0.05}
        saturation={1.2}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        className="!flex !items-center !justify-center !w-full !h-full hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] transition-all duration-500"
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
      </GlassSurface>
    </button>
  );
}
