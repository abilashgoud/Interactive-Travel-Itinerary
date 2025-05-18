import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Constants for timeline rendering and behavior
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // pixels per hour
const SNAP_THRESHOLD = 15; // minutes to snap

/**
 * TimelineView Component
 *
 * A visual scheduler component that allows users to drag, resize, and position
 * activities on a timeline with auto-snapping to time slots.
 *
 * @param {Object} day - The day object containing activities to display
 * @param {Function} onUpdateActivity - Callback to update an activity
 * @param {Function} onClose - Callback when the timeline view is closed
 */
const TimelineView = ({ day, onUpdateActivity, onClose }) => {
  // Initialize activities with calculated start times and default durations
  const [activities, setActivities] = useState(
    day.activities.map((act) => ({
      ...act,
      startMinutes: timeToMinutes(act.time || "09:00"),
      duration: 60, // Default 1 hour
    }))
  );

  // State for drag and resize operations
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [startPos, setStartPos] = useState(null);
  const containerRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    // Scroll to 8am (8 * 60 = 480 minutes) by default
    if (containerRef.current) {
      containerRef.current.scrollTop = 8 * HOUR_HEIGHT - 100;
      setScrollOffset(containerRef.current.scrollTop);
    }

    const handleScroll = () => {
      if (containerRef.current) {
        setScrollOffset(containerRef.current.scrollTop);
      }
    };

    containerRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Convert HH:MM time string to total minutes since midnight
   * @param {string} timeStr - Time in "HH:MM" format
   * @returns {number} Total minutes
   */
  function timeToMinutes(timeStr) {
    if (!timeStr) return 9 * 60; // Default to 9am
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + (minutes || 0);
  }

  /**
   * Convert minutes since midnight to HH:MM format
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted time "HH:MM"
   */
  function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // Start dragging an activity
  const handleDragStart = (e, idx) => {
    setDraggingIdx(idx);
    setStartPos({
      y: e.clientY,
      startMinutes: activities[idx].startMinutes,
    });
  };

  // Start resizing an activity
  const handleResizeStart = (e, idx) => {
    e.stopPropagation();
    setResizing(idx);
    setStartPos({
      y: e.clientY,
      duration: activities[idx].duration,
    });
  };

  /**
   * Handle mouse movement during drag or resize operations
   * Includes snapping to 15-minute intervals for better UX
   */
  const handleMouseMove = (e) => {
    if (draggingIdx === null && resizing === null) return;

    const diff = e.clientY - startPos.y;
    const minutesDiff = Math.round(diff / (HOUR_HEIGHT / 60));

    if (draggingIdx !== null) {
      // Moving the activity
      const newStartMinutes = startPos.startMinutes + minutesDiff;
      // Snap to 15 minute intervals
      const snappedMinutes =
        Math.round(newStartMinutes / SNAP_THRESHOLD) * SNAP_THRESHOLD;

      setActivities((prev) =>
        prev.map((act, idx) =>
          idx === draggingIdx
            ? {
                ...act,
                startMinutes: Math.max(
                  0,
                  Math.min(24 * 60 - act.duration, snappedMinutes)
                ),
              }
            : act
        )
      );
    } else if (resizing !== null) {
      // Resizing the activity
      const newDuration = startPos.duration + minutesDiff;
      const snappedDuration =
        Math.round(newDuration / SNAP_THRESHOLD) * SNAP_THRESHOLD;

      setActivities((prev) =>
        prev.map((act, idx) =>
          idx === resizing
            ? {
                ...act,
                duration: Math.max(30, Math.min(8 * 60, snappedDuration)),
              }
            : act
        )
      );
    }
  };

  /**
   * Apply changes when drag or resize operations end
   * Updates activity times and durations in the parent component
   */
  const handleMouseUp = () => {
    if (draggingIdx !== null || resizing !== null) {
      // Update activities with new times
      const updatedActivities = activities.map((act) => ({
        ...act,
        time: minutesToTime(act.startMinutes),
        notes:
          act.notes +
          (act.notes ? " | " : "") +
          `Duration: ~${Math.round(act.duration / 60)} hour(s)`,
      }));

      // Save changes
      updatedActivities.forEach((act) => {
        onUpdateActivity(day.id, act.id, {
          name: act.name,
          time: act.time,
          notes: act.notes,
        });
      });

      // Reset state
      setDraggingIdx(null);
      setResizing(null);
      setStartPos(null);
    }
  };

  const handleScrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop -= HOUR_HEIGHT;
    }
  };

  const handleScrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop += HOUR_HEIGHT;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-primary">
            {day.name} Timeline
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Scroll up button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 opacity-80"
            onClick={handleScrollUp}
          >
            <ChevronUp size={20} />
          </Button>

          {/* Main timeline container with events handling */}
          <div
            ref={containerRef}
            className="h-full overflow-y-auto pb-4 px-6"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="relative border-l border-r mx-16"
              style={{ height: `${24 * HOUR_HEIGHT}px` }}
            >
              {/* Time markers - one for each hour */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full border-t border-gray-200 flex items-center"
                  style={{ top: `${hour * HOUR_HEIGHT}px` }}
                >
                  <span className="absolute -left-16 -mt-3 text-xs text-gray-500">
                    {`${String(hour).padStart(2, "0")}:00`}
                  </span>
                  <span className="absolute -right-16 -mt-3 text-xs text-gray-500">
                    {`${String(hour).padStart(2, "0")}:00`}
                  </span>
                </div>
              ))}

              {/* Activity blocks - draggable and resizable */}
              {activities.map((activity, idx) => (
                <motion.div
                  key={activity.id}
                  className={cn(
                    "absolute left-0 right-0 mx-1 rounded-md px-2 py-1 cursor-grab flex flex-col",
                    draggingIdx === idx
                      ? "shadow-xl z-10 opacity-90"
                      : "shadow-md",
                    "bg-primary/80 text-primary-foreground"
                  )}
                  style={{
                    top: `${(activity.startMinutes / 60) * HOUR_HEIGHT}px`,
                    height: `${(activity.duration / 60) * HOUR_HEIGHT}px`,
                  }}
                  onMouseDown={(e) => handleDragStart(e, idx)}
                  animate={{ scale: draggingIdx === idx ? 1.02 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="text-sm font-medium truncate">
                    {activity.name}
                  </div>
                  <div className="text-xs opacity-80 flex items-center">
                    <Clock size={10} className="mr-1" />
                    {minutesToTime(activity.startMinutes)}
                  </div>
                  {/* Resize handle */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-2 bg-secondary/30 hover:bg-secondary/50 cursor-ns-resize rounded-b"
                    onMouseDown={(e) => handleResizeStart(e, idx)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll down button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 opacity-80"
            onClick={handleScrollDown}
          >
            <ChevronDown size={20} />
          </Button>
        </div>

        <div className="p-4 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose} className="bg-primary">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
