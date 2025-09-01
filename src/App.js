import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase"; // Make sure auth is imported here
import Login from "./component/Login";
import ForgotPassword from "./component/ForgotPassword";
import Dashboard from "./component/Dashboard";
import Profile from "./component/Profile";
import Settings from "./component/setting";
import RegistrationForm from "./component/RegistrationForm";
import Receipts from "./component/Receipts";
import InvestmentQuestionnaire from "./component/Investment-Questionnaire";
import RecommendationPage from "./component/RecommendationPage";
import FriendSystem from "./component/FriendSystem";
import HomePage from "./component/HomePage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update the user state
      setLoading(false); // Stop loading once we know the auth state
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <RegistrationForm />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Private routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/investment-questionnaire"
          element={user ? <InvestmentQuestionnaire /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/" />}
        />
        <Route
          path="/receipts"
          element={user ? <Receipts /> : <Navigate to="/" />}
        />
        <Route
          path="/recommendation"
          element={user ? <RecommendationPage /> : <Navigate to="/" />}
        />
        <Route
          path="/friend-system"
          element={user ? <FriendSystem /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
