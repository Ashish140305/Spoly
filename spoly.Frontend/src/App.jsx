import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
// Assume LiveNotes is the workspace component you build next
import LiveNotes from './pages/LiveNotes';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please add it to your .env.local file.");
}

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

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
    </ClerkProvider>
  );
}

export default App;