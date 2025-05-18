import React, { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";

const ItineraryContext = createContext();

export const useItinerary = () => useContext(ItineraryContext);

const ITINERARY_STORAGE_KEY = "tripcraft_itinerary_v2";

export const ItineraryProvider = ({ children }) => {
  const { toast } = useToast();
  const [days, setDays] = useState([]);
  const [itineraryTitle, setItineraryTitle] = useState("My Dream Vacation");

  useEffect(() => {
    try {
      const storedItinerary = localStorage.getItem(ITINERARY_STORAGE_KEY);
      if (storedItinerary) {
        const parsedItinerary = JSON.parse(storedItinerary);
        setDays(parsedItinerary.days || []);
        setItineraryTitle(parsedItinerary.title || "My Dream Vacation");
      }
    } catch (error) {
      console.error("Failed to load itinerary from localStorage", error);
      toast({
        title: "Error Loading Data",
        description: "Could not load your saved itinerary. Starting fresh.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    try {
      const itineraryToSave = JSON.stringify({ title: itineraryTitle, days });
      localStorage.setItem(ITINERARY_STORAGE_KEY, itineraryToSave);
    } catch (error) {
      console.error("Failed to save itinerary to localStorage", error);
      toast({
        title: "Error Saving Data",
        description: "Could not save your itinerary. Changes might be lost.",
        variant: "destructive",
      });
    }
  }, [days, itineraryTitle, toast]);

  const addDay = (dayName) => {
    if (!dayName.trim()) {
      toast({
        title: "Oops!",
        description: "Day name cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    const newDay = {
      id: `day-${Date.now()}`,
      name: dayName,
      activities: [],
    };
    setDays((prevDays) => [...prevDays, newDay]);
    toast({
      title: "Day Added!",
      description: `Successfully added "${newDay.name}".`,
      className: "bg-accent text-accent-foreground",
    });
    return true;
  };

  const updateDayName = (dayId, newName) => {
    if (!newName.trim()) {
      toast({
        title: "Oops!",
        description: "Day name cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId ? { ...day, name: newName } : day
      )
    );
    toast({
      title: "Day Updated!",
      description: "Day name changed successfully.",
      className: "bg-accent text-accent-foreground",
    });
    return true;
  };

  const deleteDay = (dayId) => {
    setDays((prevDays) => prevDays.filter((day) => day.id !== dayId));
    toast({
      title: "Day Deleted!",
      description: "The day has been removed from your itinerary.",
      variant: "destructive",
    });
  };

  const addActivity = (dayId, activityDetails) => {
    if (!activityDetails.name.trim()) {
      toast({
        title: "Oops!",
        description: "Activity name cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    const newActivity = { ...activityDetails, id: `activity-${Date.now()}` };
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      )
    );
    toast({
      title: "Activity Added!",
      description: `Successfully added "${newActivity.name}".`,
      className: "bg-accent text-accent-foreground",
    });
    return true;
  };

  const updateActivity = (dayId, activityId, updatedActivityDetails) => {
    if (!updatedActivityDetails.name.trim()) {
      toast({
        title: "Oops!",
        description: "Activity name cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((act) =>
                act.id === activityId
                  ? { ...act, ...updatedActivityDetails }
                  : act
              ),
            }
          : day
      )
    );
    toast({
      title: "Activity Updated!",
      description: `Successfully updated "${updatedActivityDetails.name}".`,
      className: "bg-accent text-accent-foreground",
    });
    return true;
  };

  const deleteActivity = (dayId, activityId) => {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter((act) => act.id !== activityId),
            }
          : day
      )
    );
    toast({
      title: "Activity Deleted!",
      description: "The activity has been removed.",
      variant: "destructive",
    });
  };

  const reorderActivities = (dayId, startIndex, endIndex) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.id === dayId) {
          const newActivities = Array.from(day.activities);
          const [removed] = newActivities.splice(startIndex, 1);
          newActivities.splice(endIndex, 0, removed);
          return { ...day, activities: newActivities };
        }
        return day;
      })
    );
    toast({
      title: "Activities Reordered!",
      description: "Your activities have been successfully reordered.",
      className: "bg-accent text-accent-foreground",
    });
  };

  // Helper function to check time conflicts and find a new available time
  const findAvailableTime = (activities, activityTime) => {
    if (!activityTime) return null;

    // Convert time string to minutes for easy comparison
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + (minutes || 0);
    };

    // Convert minutes back to time string
    const minutesToTime = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const activityMinutes = timeToMinutes(activityTime);

    // Check if this time is already taken
    const isTimeConflict = activities.some(
      (act) => act.time && timeToMinutes(act.time) === activityMinutes
    );

    // If no conflict, return original time
    if (!isTimeConflict) return activityTime;

    // Find next available 30-minute slot
    let proposedMinutes = activityMinutes;
    while (
      activities.some(
        (act) => act.time && timeToMinutes(act.time) === proposedMinutes
      )
    ) {
      proposedMinutes += 30; // Try 30 minutes later

      // Wrap around to next day if we pass midnight
      if (proposedMinutes >= 24 * 60) {
        proposedMinutes = 9 * 60; // Default to 9 AM if all times are taken
      }
    }

    return minutesToTime(proposedMinutes);
  };

  const moveActivityToDay = (sourceDayId, destinationDayId, activityId) => {
    setDays((prevDays) => {
      // Find source day and activity
      const sourceDayIndex = prevDays.findIndex(
        (day) => day.id === sourceDayId
      );
      if (sourceDayIndex === -1) return prevDays;

      const sourceDay = prevDays[sourceDayIndex];
      const activityIndex = sourceDay.activities.findIndex(
        (act) => act.id === activityId
      );
      if (activityIndex === -1) return prevDays;

      // Get activity to move
      const activity = sourceDay.activities[activityIndex];

      // Clone days array for immutability
      const newDays = [...prevDays];

      // Remove activity from source day
      newDays[sourceDayIndex] = {
        ...sourceDay,
        activities: sourceDay.activities.filter((act) => act.id !== activityId),
      };

      // Add activity to destination day
      const destDayIndex = newDays.findIndex(
        (day) => day.id === destinationDayId
      );
      if (destDayIndex !== -1) {
        // Check for time conflicts and adjust if needed
        const destDayActivities = newDays[destDayIndex].activities;
        const adjustedTime = findAvailableTime(
          destDayActivities,
          activity.time
        );

        const movedActivity = {
          ...activity,
          time: adjustedTime,
        };

        // Add activity to destination day
        newDays[destDayIndex] = {
          ...newDays[destDayIndex],
          activities: [...newDays[destDayIndex].activities, movedActivity],
        };

        // Set a flag if time was adjusted
        const wasTimeAdjusted = adjustedTime !== activity.time;

        // Use setTimeout to ensure toast shows after state update
        if (wasTimeAdjusted) {
          setTimeout(() => {
            toast({
              title: "Time Conflict Resolved",
              description: `Activity moved to ${adjustedTime} to avoid scheduling conflicts.`,
              className: "bg-warning text-warning-foreground",
            });
          }, 100);
        }
      }

      return newDays;
    });

    toast({
      title: "Activity Moved!",
      description: "Successfully moved activity to another day.",
      className: "bg-accent text-accent-foreground",
    });
  };

  const updateItineraryTitle = (newTitle) => {
    if (!newTitle.trim()) {
      toast({
        title: "Oops!",
        description: "Itinerary title cannot be empty.",
        variant: "destructive",
      });
      return false;
    }
    setItineraryTitle(newTitle);
    toast({
      title: "Itinerary Title Updated!",
      description: `Title changed to "${newTitle}".`,
      className: "bg-accent text-accent-foreground",
    });
    return true;
  };

  const value = {
    days,
    itineraryTitle,
    addDay,
    updateDayName,
    deleteDay,
    addActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
    moveActivityToDay,
    updateItineraryTitle,
    setDays,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};
