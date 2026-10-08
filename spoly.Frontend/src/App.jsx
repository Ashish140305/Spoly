import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import { AuthProvider, SignedIn, SignedOut } from "./components/MiniMothAuth";

// Import Pages
import LandingPage from "./pages/LandingPage";
import LiveNotes from "./pages/LiveNotes";
import AboutUs from "./pages/AboutUs";
import LegalDoc from "./pages/LegalDoc";
import TermsOfService from "./pages/TermsOfService";

// A wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

// 🚀 NEW: Invisible component that listens to the Spoly Chrome Extension
const ExtensionListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleExtensionMessage = (event) => {
      // Listen for the silent upload success message from content.js
      if (event.data && event.data.type === 'SPOLY_UPLOAD_COMPLETE') {
        console.log("✅ Audio successfully received from Spoly Extension!");
        
        // Navigate the user directly to the Live Notes dashboard
        navigate('/live'); 
      }
    };

    // Attach the global listener
    window.addEventListener('message', handleExtensionMessage);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('message', handleExtensionMessage);
  }, [navigate]);

  return null; // This component works in the background and renders nothing
};


function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Mount the listener inside the Router so it can use navigate() */}
        <ExtensionListener />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<LegalDoc />} />
          <Route path="/terms" element={<TermsOfService />} />

          {/* Protected Routes */}
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveNotes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
