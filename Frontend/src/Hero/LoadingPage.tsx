import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-white z-50">
      <div className="animate-zoom-out">
        <img
          src="/rise-logo.png"
          alt="The Rise AI Logo"
          className="max-w-[10vw] max-h-[10vh] object-contain"
        />
      </div>
    </div>
  );
};

export default LoadingPage;
