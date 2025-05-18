import React from "react";
import { Edit3, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useItinerary } from "@/contexts/ItineraryContext";
import { Draggable } from "react-beautiful-dnd";

const ActivityItem = ({ dayId, activity, index, onEdit }) => {
  const { deleteActivity } = useItinerary();

  return (
    <Draggable draggableId={activity.id} index={index} type="activity">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center justify-between p-3 mb-2 rounded-lg border
                      ${
                        snapshot.isDragging
                          ? "bg-secondary/30 shadow-2xl scale-105"
                          : "bg-card/80 hover:bg-card shadow-md"
                      }
                      transition-all duration-200 ease-in-out group`}
        >
          <div
            {...provided.dragHandleProps}
            className="p-1 mr-2 cursor-grab text-muted-foreground hover:text-primary"
          >
            <GripVertical size={20} />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-primary">{activity.name}</p>
            {activity.time && (
              <p className="text-xs text-muted-foreground">
                Time: {activity.time}
              </p>
            )}
            {activity.notes && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                Notes: {activity.notes}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80 h-8 w-8"
              onClick={() => onEdit(activity)}
            >
              <Edit3 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/80 h-8 w-8"
              onClick={() => deleteActivity(dayId, activity.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ActivityItem;
