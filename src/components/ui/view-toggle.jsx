import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, List, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ViewToggle Component
 *
 * A custom toggle component that allows users to switch between different view modes
 * (list, calendar, and grid) with smooth animations and visual feedback.
 *
 * @param {string} currentView - The currently active view ("list", "calendar", or "grid")
 * @param {Function} onViewChange - Callback function invoked when a view is selected
 */
const ViewToggle = ({ currentView, onViewChange }) => {
  return (
    <div className="bg-card/90 backdrop-blur-md rounded-full p-2 shadow-md border flex text-foreground mb-5 max-w-xs mx-auto">
      <ViewButton
        isActive={currentView === "list"}
        onClick={() => onViewChange("list")}
        icon={<List size={16} />}
        label="List View"
      />
      <ViewButton
        isActive={currentView === "calendar"}
        onClick={() => onViewChange("calendar")}
        icon={<Calendar size={16} />}
        label="Calendar View"
      />
      <ViewButton
        isActive={currentView === "grid"}
        onClick={() => onViewChange("grid")}
        icon={<LayoutGrid size={16} />}
        label="Grid View"
      />
    </div>
  );
};

/**
 * ViewButton Component
 *
 * Individual button within the ViewToggle component with animated active state.
 * Uses Framer Motion's layoutId for smooth transitions between active states.
 *
 * @param {boolean} isActive - Whether this button is currently selected
 * @param {Function} onClick - Handler for click events
 * @param {ReactElement} icon - Icon element to display
 * @param {string} label - Text label for the button
 */
const ViewButton = ({ isActive, onClick, icon, label }) => (
  <div className="relative flex-1">
    {isActive ? (
      <motion.div
        layoutId="activeViewIndicator"
        className="absolute inset-0 bg-primary rounded-full"
        transition={{ type: "spring", duration: 0.5 }}
      />
    ) : (
      <div className="absolute inset-0 bg-accent/0 hover:bg-accent/20 rounded-full transition-colors duration-200" />
    )}
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`w-full h-full relative z-10 py-2 ${
        isActive ? "text-primary-foreground" : ""
      }`}
    >
      <div className="flex items-center justify-center">
        {icon}
        <span className="ml-2">{label}</span>
      </div>
    </Button>
  </div>
);

export default ViewToggle;
