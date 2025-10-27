import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => `thread_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await sendChatMessage({
        thread_id: threadId,
        message: messageText,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden relative">
      {/* Flowing Wave Background */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-90"
          style={{
            backgroundImage: 'url(/chat-bg.jpg)',
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />
      </div>

      {/* Header - Transparent */}
      <div className="bg-transparent px-4 sm:px-6 py-4 sm:py-6 md:py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-white/[0.2] via-white/[0.12] to-white/[0.06] backdrop-blur-xl border border-white/[0.25] rounded-full flex items-center justify-center shadow-[0_4px_16px_0_rgba(255,255,255,0.2),inset_0_0_10px_rgba(255,255,255,0.1)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">Rise AI Assistant</h2>
            <p className="text-xs sm:text-sm text-white/70">Online</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/[0.18] hover:bg-white/[0.2] transition-all duration-300 flex items-center justify-center z-10 shadow-[0_4px_16px_0_rgba(255,255,255,0.15),inset_0_0_10px_rgba(255,255,255,0.05)]"
          aria-label="Close chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-8 relative z-10">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 relative z-10">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-6 py-2 sm:py-3 relative overflow-hidden ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-white/[0.18] via-white/[0.12] to-white/[0.06] backdrop-blur-3xl border border-white/[0.22] shadow-[0_8px_32px_0_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_15px_rgba(255,255,255,0.08)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/25 before:via-transparent before:to-transparent before:opacity-60 before:-z-10'
                    : 'bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-white/[0.03] backdrop-blur-3xl border border-white/[0.15] shadow-[0_8px_32px_0_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_15px_rgba(255,255,255,0.05)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/15 before:via-transparent before:to-transparent before:opacity-50 before:-z-10'
                }`}
              >
                <p className="text-sm sm:text-base text-white relative z-10">{message.text}</p>
                <p className="text-xs mt-1 text-white/60 relative z-10">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Transparent */}
      <div className="bg-transparent px-4 sm:px-6 py-4 sm:py-6 md:py-8 relative z-10">
        <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3 relative z-10">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 sm:px-4 py-3 sm:py-4 md:py-5 text-sm sm:text-base bg-transparent backdrop-blur-xl border border-white/[0.2] rounded-full focus:outline-none focus:border-white/[0.35] focus:shadow-[0_4px_20px_0_rgba(255,255,255,0.2),inset_0_0_15px_rgba(255,255,255,0.08)] transition-all duration-300 text-white placeholder-white/50 shadow-[0_4px_16px_0_rgba(0,0,0,0.3),inset_0_0_10px_rgba(255,255,255,0.05)]"
          />
          <button
            onClick={handleSend}
            disabled={inputValue.trim() === '' || isLoading}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-white/[0.25] via-white/[0.15] to-white/[0.08] backdrop-blur-xl border border-white/[0.25] text-white rounded-full hover:from-white/[0.35] hover:via-white/[0.25] hover:to-white/[0.15] disabled:from-white/[0.05] disabled:via-white/[0.03] disabled:to-white/[0.01] disabled:cursor-not-allowed disabled:text-white/30 transition-all duration-300 flex items-center justify-center flex-shrink-0 shadow-[0_8px_24px_0_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_12px_32px_0_rgba(255,255,255,0.3),0_0_0_1px_rgba(255,255,255,0.2)] relative overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-transparent before:opacity-60 before:-z-10"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
