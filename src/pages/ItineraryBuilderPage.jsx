import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  FileText,
  Edit2,
  Save,
  Eye,
  Settings,
  ListChecks,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import DayCard from "@/components/itinerary/DayCard";
import { useItinerary } from "@/contexts/ItineraryContext";
import html2pdf from "html2pdf.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ViewToggle from "@/components/ui/view-toggle";
import TimelineView from "@/components/ui/timeline-view";

/**
 * React Beautiful DnD Compatibility Fix for React 18 and StrictMode
 *
 * This hook resolves the "Unable to find draggable with id" error that occurs when using
 * react-beautiful-dnd with React 18 in StrictMode. The issue happens because StrictMode
 * causes components to mount, unmount, and remount during development, which breaks DnD's
 * element tracking.
 *
 * The hook delays enabling drag and drop functionality until after the component has fully
 * mounted using requestAnimationFrame, avoiding the timing issues caused by StrictMode.
 *
 * @returns {boolean} Whether drag and drop functionality should be enabled
 */
const useDndFix = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  return enabled;
};

const ItineraryBuilderPage = () => {
  const {
    days,
    addDay,
    itineraryTitle,
    updateItineraryTitle,
    setDays,
    moveActivityToDay,
    updateActivity,
  } = useItinerary();
  const [newDayName, setNewDayName] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempItineraryTitle, setTempItineraryTitle] = useState(itineraryTitle);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const dndEnabled = useDndFix();
  const [currentView, setCurrentView] = useState("list");
  const [timelineDay, setTimelineDay] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTempItineraryTitle(itineraryTitle);
  }, [itineraryTitle]);

  useEffect(() => {
    if (days.length > 0) {
      const initialExpandedState = {};
      days.forEach((day) => {
        if (expandedDays[day.id] === undefined) {
          initialExpandedState[day.id] = true;
        } else {
          initialExpandedState[day.id] = expandedDays[day.id];
        }
      });
      setExpandedDays(initialExpandedState);
    }
  }, [days]);

  const handleAddDay = () => {
    if (addDay(newDayName)) {
      setNewDayName("");
      // The useEffect for 'days' will handle expanding the new day
    }
  };

  const handleTitleSave = () => {
    if (updateItineraryTitle(tempItineraryTitle)) {
      setIsEditingTitle(false);
    }
  };

  const exportToPdf = () => {
    setIsExporting(true);
    const itineraryElement = document.getElementById(
      "itinerary-content-for-pdf"
    );
    if (!itineraryElement) {
      setIsExporting(false);
      return;
    }

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${itineraryTitle.replace(/\s+/g, "_") || "itinerary"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: -window.scrollY,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(itineraryElement)
      .set(options)
      .save()
      .then(() => {
        setIsExporting(false);
      })
      .catch((err) => {
        console.error("Error exporting PDF:", err);
        setIsExporting(false);
      });
  };

  const onDragEndDays = (result) => {
    if (!result.destination) return;

    const { source, destination, type, draggableId } = result;

    // Handle days reordering
    if (type === "day") {
      if (source.index === destination.index) return;

      const items = Array.from(days);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setDays(items);
      return;
    }

    // Handle activities movement between days or within a day
    if (type === "activity") {
      // Moving within the same day
      if (source.droppableId === destination.droppableId) {
        const dayId = source.droppableId;
        const startIndex = source.index;
        const endIndex = destination.index;

        if (startIndex === endIndex) return;

        const day = days.find((d) => d.id === dayId);
        if (!day) return;

        // Update the day's activities array
        const newActivities = Array.from(day.activities);
        const [removed] = newActivities.splice(startIndex, 1);
        newActivities.splice(endIndex, 0, removed);

        setDays((prevDays) =>
          prevDays.map((d) =>
            d.id === dayId ? { ...d, activities: newActivities } : d
          )
        );
      }
      // Moving between different days
      else {
        const sourceDayId = source.droppableId;
        const destDayId = destination.droppableId;
        const activityId = draggableId;

        moveActivityToDay(sourceDayId, destDayId, activityId);
      }
    }
  };

  const toggleDayExpansion = (dayId) => {
    setExpandedDays((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const openTimelineView = (day) => {
    setTimelineDay(day);
  };

  const closeTimelineView = () => {
    setTimelineDay(null);
  };

  // Grid View Layout
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {days.map((day, index) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/90 backdrop-blur-sm shadow-lg rounded-xl border border-primary/10 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-br from-primary/80 via-primary/70 to-secondary/70">
              <h3 className="font-serif font-bold text-xl text-primary-foreground flex items-center">
                <span className="w-7 h-7 rounded-full bg-primary/50 flex items-center justify-center text-sm mr-2">
                  {index + 1}
                </span>
                {day.name}
              </h3>
            </div>

            <div className="p-4">
              {day.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                  No activities yet
                </p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {day.activities.slice(0, 3).map((activity) => (
                    <li
                      key={activity.id}
                      className="p-2 rounded-md bg-accent/10 border border-accent/20 text-sm"
                    >
                      <p className="font-medium">{activity.name}</p>
                      {activity.time && (
                        <p className="text-xs text-muted-foreground">
                          ⏰ {activity.time}
                        </p>
                      )}
                    </li>
                  ))}
                  {day.activities.length > 3 && (
                    <p className="text-xs text-center text-primary">
                      +{day.activities.length - 3} more activities
                    </p>
                  )}
                </ul>
              )}

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-primary/30 text-primary"
                  onClick={() => toggleDayExpansion(day.id)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-accent/50 text-accent"
                  onClick={() => openTimelineView(day)}
                >
                  Timeline
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Calendar View Layout
  const renderCalendarView = () => {
    return (
      <div className="bg-card/90 backdrop-blur-sm shadow-lg rounded-xl border border-primary/10 p-6 overflow-hidden">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium text-primary">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNumber = i + 1;
            const matchingDay = days.find((d, idx) => idx + 1 === dayNumber);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className={`aspect-square border rounded-md p-1 ${
                  matchingDay
                    ? "border-primary/20 bg-primary/5 cursor-pointer"
                    : "border-muted-foreground/20"
                }`}
                onClick={() => matchingDay && openTimelineView(matchingDay)}
              >
                <div className="h-full flex flex-col">
                  <div className="text-xs text-right text-muted-foreground">
                    {dayNumber}
                  </div>
                  {matchingDay && (
                    <div className="flex-grow">
                      <p className="text-xs font-medium text-primary truncate">
                        {matchingDay.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {matchingDay.activities.length} activities
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8 selection:bg-secondary selection:text-secondary-foreground">
      <div id="itinerary-content-for-pdf-wrapper">
        <div id="itinerary-content-for-pdf">
          <header className="mb-10 text-center">
            {isEditingTitle ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center items-center gap-2 max-w-xl mx-auto"
              >
                <Input
                  type="text"
                  value={tempItineraryTitle}
                  onChange={(e) => setTempItineraryTitle(e.target.value)}
                  className="text-4xl md:text-5xl font-serif font-bold text-primary text-center bg-card/80 border-primary/50 focus:ring-primary px-4 py-2 pb-4"
                  autoFocus
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                />
                <Button
                  onClick={handleTitleSave}
                  size="icon"
                  variant="ghost"
                  className="text-primary hover:bg-primary/10 h-12 w-12"
                >
                  <Save size={24} />
                </Button>
              </motion.div>
            ) : (
              <div
                className="flex justify-center items-center gap-3 group cursor-pointer"
                onClick={() => {
                  setIsEditingTitle(true);
                  setTempItineraryTitle(itineraryTitle);
                }}
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {itineraryTitle}
                </h1>
                <Edit2
                  size={28}
                  className="text-primary opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                />
              </div>
            )}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mt-2"
            >
              Craft your journey, one memorable day at a time.
            </motion.p>
          </header>

          <motion.div
            layout
            className="mb-8 p-6 bg-card/70 backdrop-blur-md rounded-xl shadow-xl border border-primary/10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Input
              type="text"
              value={newDayName}
              onChange={(e) => setNewDayName(e.target.value)}
              placeholder="Name your next adventure day (e.g., Parisian Charm)"
              className="flex-grow h-12 text-lg bg-card/90 border-primary/30 focus:ring-primary placeholder-muted-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleAddDay()}
            />
            <Button
              onClick={handleAddDay}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg shadow-lg hover:shadow-primary/40 whitespace-nowrap"
            >
              <PlusCircle className="mr-2 h-6 w-6" /> Add Day
            </Button>
          </motion.div>

          {/* View toggle section */}
          {days.length > 0 && (
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          )}

          <AnimatePresence>
            {days.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-muted-foreground py-16"
              >
                <ListChecks
                  size={64}
                  className="mx-auto mb-4 text-primary/50"
                />
                <p className="text-2xl font-serif mb-2">
                  Your Itinerary Awaits Creation
                </p>
                <p className="text-lg">
                  Start by adding a day above to map out your exciting plans!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {isMounted && days.length > 0 && (
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentView === "list" && (
                <>
                  {dndEnabled ? (
                    <DragDropContext onDragEnd={onDragEndDays}>
                      <Droppable droppableId="all-days" type="day">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-0"
                          >
                            {days.map((day, index) => (
                              <Draggable
                                key={day.id}
                                draggableId={day.id}
                                index={index}
                                type="day"
                              >
                                {(providedDraggable) => (
                                  <div
                                    ref={providedDraggable.innerRef}
                                    {...providedDraggable.draggableProps}
                                  >
                                    <div
                                      {...providedDraggable.dragHandleProps}
                                      className="pt-2 pb-1 flex justify-center opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                      <GripVertical
                                        size={24}
                                        className="text-primary/50 cursor-ns-resize"
                                      />
                                    </div>
                                    <DayCard
                                      day={day}
                                      index={index}
                                      isExpanded={!!expandedDays[day.id]}
                                      onToggleExpand={toggleDayExpansion}
                                      parentDragEnabled={true}
                                      onTimelineView={() =>
                                        openTimelineView(day)
                                      }
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <div className="space-y-0">
                      {days.map((day, index) => (
                        <div key={day.id}>
                          <div className="pt-2 pb-1 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                            <GripVertical
                              size={24}
                              className="text-primary/50 cursor-ns-resize"
                            />
                          </div>
                          <DayCard
                            day={day}
                            index={index}
                            isExpanded={!!expandedDays[day.id]}
                            onToggleExpand={toggleDayExpansion}
                            parentDragEnabled={false}
                            onTimelineView={() => openTimelineView(day)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {currentView === "calendar" && renderCalendarView()}
              {currentView === "grid" && renderGridView()}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 print:hidden"
        >
          <Link to="/summary">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 h-12 text-lg shadow-md hover:shadow-primary/20"
            >
              <Eye className="mr-2 h-5 w-5" /> View Summary
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={exportToPdf}
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg shadow-lg hover:shadow-accent/40"
            disabled={isExporting}
          >
            <FileText className="mr-2 h-5 w-5" />
            {isExporting ? "Exporting..." : "Export to PDF"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] print:hidden"
          >
            <div className="bg-card p-8 rounded-xl shadow-2xl text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mx-auto mb-4"
              >
                <Settings size={48} className="text-primary" />
              </motion.div>
              <p className="text-xl font-semibold text-primary">
                Generating PDF, please wait...
              </p>
              <p className="text-muted-foreground">
                This might take a few moments.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline view modal */}
      <AnimatePresence>
        {timelineDay && (
          <TimelineView
            day={timelineDay}
            onUpdateActivity={updateActivity}
            onClose={closeTimelineView}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItineraryBuilderPage;
