import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/pages/LandingPage";
import ItineraryBuilderPage from "@/pages/ItineraryBuilderPage";
import SummaryPage from "@/pages/SummaryPage";
import { ItineraryProvider } from "@/contexts/ItineraryContext";

const AnimatedPage = ({ children }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: location.pathname === "/" ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: location.pathname === "/" ? 50 : -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <ItineraryProvider>
      <Router future={{ v7_startTransition: true }}>
        <div className="min-h-screen bg-tripcraft-background text-gray-800">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <LandingPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/planner"
                element={
                  <AnimatedPage>
                    <ItineraryBuilderPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/summary"
                element={
                  <AnimatedPage>
                    <SummaryPage />
                  </AnimatedPage>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <Toaster />
        </div>
      </Router>
    </ItineraryProvider>
  );
}

export default App;
