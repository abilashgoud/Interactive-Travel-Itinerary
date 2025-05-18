import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit3,
  Trash2,
  GripVertical,
  Save,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ActivityItem from "@/components/itinerary/ActivityItem";
import AddActivityModal from "@/components/itinerary/AddActivityModal";
import { useItinerary } from "@/contexts/ItineraryContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Workaround for react-beautiful-dnd in React 18 with StrictMode
// This fixes the "Unable to find draggable with id" error
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

const DayCard = ({
  day,
  index: dayIndex,
  isExpanded,
  onToggleExpand,
  parentDragEnabled,
  onTimelineView,
}) => {
  const { updateDayName, deleteDay, reorderActivities } = useItinerary();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDayName, setTempDayName] = useState(day.name);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const dndEnabled = useDndFix();

  const handleNameSave = () => {
    if (updateDayName(day.id, tempDayName)) {
      setIsEditingName(false);
    }
  };

  const openAddActivityModal = () => {
    setEditingActivity(null);
    setActivityModalOpen(true);
  };

  const openEditActivityModal = (activity) => {
    setEditingActivity(activity);
    setActivityModalOpen(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    reorderActivities(day.id, result.source.index, result.destination.index);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative mb-6"
    >
      <Card className="bg-card/90 backdrop-blur-sm shadow-xl rounded-xl border-primary/20 overflow-hidden">
        <CardHeader
          className="flex flex-row justify-between items-center p-4 bg-gradient-to-br from-primary/80 via-primary/70 to-secondary/70 cursor-pointer"
          onClick={() => onToggleExpand(day.id)}
        >
          <div className="flex items-center flex-grow">
            <span className="text-sm font-semibold text-primary-foreground mr-3 p-2 bg-primary/50 rounded-full w-8 h-8 flex items-center justify-center">
              {dayIndex + 1}
            </span>
            {isEditingName ? (
              <div className="flex-grow flex items-center">
                <Input
                  type="text"
                  value={tempDayName}
                  onChange={(e) => setTempDayName(e.target.value)}
                  className="text-xl font-semibold mr-2 flex-grow bg-card/90 text-primary placeholder-primary/50"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onBlur={handleNameSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameSave();
                  }}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNameSave();
                  }}
                  size="icon"
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                >
                  <Save size={18} />
                </Button>
              </div>
            ) : (
              <CardTitle
                className="text-xl font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                  setTempDayName(day.name);
                }}
              >
                {day.name}
              </CardTitle>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {!isEditingName && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingName(true);
                    setTempDayName(day.name);
                  }}
                >
                  <Edit3 size={18} />
                </Button>
                {onTimelineView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimelineView(day);
                    }}
                    title="View Timeline"
                  >
                    <Clock size={18} />
                  </Button>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive-foreground hover:bg-destructive/50 h-9 w-9"
              onClick={(e) => {
                e.stopPropagation();
                deleteDay(day.id);
              }}
            >
              <Trash2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-9 w-9"
            >
              {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <CardContent className="p-4 md:p-6 space-y-4 bg-card/50">
                {dndEnabled ? (
                  // Only use local DragDropContext if parent drag is not enabled
                  parentDragEnabled ? (
                    <Droppable droppableId={day.id} type="activity">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2 min-h-[50px]"
                        >
                          {day.activities.length === 0 && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm text-muted-foreground italic text-center py-4"
                            >
                              No activities yet. Click below to add one!
                            </motion.p>
                          )}
                          {day.activities.map((activity, index) => (
                            <ActivityItem
                              key={activity.id}
                              dayId={day.id}
                              activity={activity}
                              index={index}
                              onEdit={openEditActivityModal}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId={day.id}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 min-h-[50px]"
                          >
                            {day.activities.length === 0 && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-muted-foreground italic text-center py-4"
                              >
                                No activities yet. Click below to add one!
                              </motion.p>
                            )}
                            {day.activities.map((activity, index) => (
                              <ActivityItem
                                key={activity.id}
                                dayId={day.id}
                                activity={activity}
                                index={index}
                                onEdit={openEditActivityModal}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )
                ) : (
                  <div className="space-y-2 min-h-[50px]">
                    {day.activities.length === 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-muted-foreground italic text-center py-4"
                      >
                        No activities yet. Click below to add one!
                      </motion.p>
                    )}
                    {day.activities.map((activity, index) => (
                      <ActivityItem
                        key={activity.id}
                        dayId={day.id}
                        activity={activity}
                        index={index}
                        onEdit={openEditActivityModal}
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary transition-colors duration-200 py-3"
                    onClick={openAddActivityModal}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Activity
                  </Button>

                  {onTimelineView && (
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent/10 hover:border-accent transition-colors duration-200 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTimelineView(day);
                      }}
                    >
                      <Clock className="mr-2 h-5 w-5" /> Timeline View
                    </Button>
                  )}
                </div>
              </CardContent>
            </motion.section>
          )}
        </AnimatePresence>
      </Card>
      {activityModalOpen && (
        <AddActivityModal
          dayId={day.id}
          isOpen={activityModalOpen}
          onOpenChange={setActivityModalOpen}
          existingActivity={editingActivity}
          dayActivities={day.activities}
        />
      )}
    </motion.div>
  );
};

export default DayCard;
