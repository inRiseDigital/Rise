import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Hero/Home"
import LoadingPage from "./Hero/LoadingPage"
import Navbar from "./components/Navbar"
import ChatPage from "./pages/ChatPage"


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Hide loading page after 1 second (matching animation duration)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={
          <>
            {isLoading && <LoadingPage />}
            {!isLoading && <Navbar activeSection={activeSection} />}
            <div className={isLoading ? 'invisible' : 'visible'}>
              <Home onSectionChange={setActiveSection} />
            </div>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
