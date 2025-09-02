import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout/Layout';
import Tutorial from './components/Onboarding/Tutorial';
import OnboardingSurvey from './components/Onboarding/OnboardingSurvey';
import { saveTutorialComplete } from './utils/storage';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AthleteDashboard from './pages/athlete/AthleteDashboard';
import VideoUpload from './pages/athlete/VideoUpload';
import Challenges from './pages/athlete/Challenges';
import AthleteProfile from './pages/athlete/AthleteProfile';
import Training from './pages/athlete/Training';
import Roadmap from './pages/athlete/Roadmap';
import CoachDashboard from './pages/coach/CoachDashboard';
import CoachAthletes from './pages/coach/CoachAthletes';
import CoachAnalytics from './pages/coach/CoachAnalytics';
import CoachBadges from './pages/coach/CoachBadges';
import CoachProfile from './pages/coach/CoachProfile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'athlete' | 'coach' }> = ({ 
  children, 
  role 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user, showTutorial, setShowTutorial, showOnboarding, setShowOnboarding } = useAuth();

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    saveTutorialComplete(true);
    if (!user?.onboardingComplete) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={!user ? <Landing /> : <Navigate to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} replace />} />
          <Route path="auth" element={!user ? <Auth /> : <Navigate to={user.role === 'athlete' ? '/athlete/dashboard' : '/coach/dashboard'} replace />} />
          
          {/* Athlete Routes */}
          <Route path="athlete/dashboard" element={
            <ProtectedRoute role="athlete">
              <AthleteDashboard />
            </ProtectedRoute>
          } />
          <Route path="athlete/upload" element={
            <ProtectedRoute role="athlete">
              <VideoUpload />
            </ProtectedRoute>
          } />
          <Route path="athlete/challenges" element={
            <ProtectedRoute role="athlete">
              <Challenges />
            </ProtectedRoute>
          } />
          <Route path="athlete/training" element={
            <ProtectedRoute role="athlete">
              <Training />
            </ProtectedRoute>
          } />
          <Route path="athlete/profile" element={
            <ProtectedRoute role="athlete">
              <AthleteProfile />
            </ProtectedRoute>
          } />
          <Route path="athlete/roadmap" element={
            <ProtectedRoute role="athlete">
              <Roadmap />
            </ProtectedRoute>
          } />
          
          {/* Coach Routes */}
          <Route path="coach/dashboard" element={
            <ProtectedRoute role="coach">
              <CoachDashboard />
            </ProtectedRoute>
          } />
          <Route path="coach/athletes" element={
            <ProtectedRoute role="coach">
              <CoachAthletes />
            </ProtectedRoute>
          } />
          <Route path="coach/analytics" element={
            <ProtectedRoute role="coach">
              <CoachAnalytics />
            </ProtectedRoute>
          } />
          <Route path="coach/badges" element={
            <ProtectedRoute role="coach">
              <CoachBadges />
            </ProtectedRoute>
          } />
          <Route path="coach/profile" element={
            <ProtectedRoute role="coach">
              <CoachProfile />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>

      {/* Tutorial Overlay */}
      {showTutorial && user?.role === 'athlete' && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}

      {/* Onboarding Survey */}
      {showOnboarding && user && (
        <OnboardingSurvey 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gray-950">
            <AppRoutes />
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;