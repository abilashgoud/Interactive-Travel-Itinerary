import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import { useItinerary } from '@/contexts/ItineraryContext';

const AddActivityModal = ({ dayId, isOpen, onOpenChange, existingActivity, dayActivities }) => {
  const { addActivity, updateActivity } = useItinerary();
  const [activityName, setActivityName] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [suggestedTime, setSuggestedTime] = useState('');

  useEffect(() => {
    if (existingActivity) {
      setActivityName(existingActivity.name);
      setActivityTime(existingActivity.time || '');
      setActivityNotes(existingActivity.notes || '');
      setSuggestedTime('');
    } else {
      setActivityName('');
      setActivityTime('');
      setActivityNotes('');
      if (dayActivities && dayActivities.length > 0) {
        const lastActivity = dayActivities[dayActivities.length - 1];
        if (lastActivity.time) {
          try {
            const [hours, minutes] = lastActivity.time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setHours(date.getHours() + 2); 
            const suggestedHours = String(date.getHours()).padStart(2, '0');
            const suggestedMinutes = String(date.getMinutes()).padStart(2, '0');
            setSuggestedTime(`${suggestedHours}:${suggestedMinutes}`);
          } catch (e) {
            setSuggestedTime('');
          }
        } else {
          setSuggestedTime('09:00'); 
        }
      } else {
        setSuggestedTime('09:00');
      }
    }
  }, [isOpen, existingActivity, dayActivities]);

  const handleSave = () => {
    const activityDetails = {
      name: activityName,
      time: activityTime || suggestedTime, 
      notes: activityNotes,
    };

    let success;
    if (existingActivity) {
      success = updateActivity(dayId, existingActivity.id, activityDetails);
    } else {
      success = addActivity(dayId, activityDetails);
    }
    
    if (success) {
      onOpenChange(false);
    }
  };

  const handleUseSuggestedTime = () => {
    setActivityTime(suggestedTime);
    setSuggestedTime('');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-tripcraft-primary">
            {existingActivity ? 'Edit Activity' : 'Add New Activity'}
          </DialogTitle>
          <DialogDescription>
            {existingActivity ? 'Update the details for your activity.' : 'Fill in the details for your new activity.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity-name" className="text-right col-span-1">
              Name
            </Label>
            <Input
              id="activity-name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Eiffel Tower Visit"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity-time" className="text-right col-span-1">
              Time
            </Label>
            <Input
              id="activity-time"
              type="time"
              value={activityTime}
              onChange={(e) => { setActivityTime(e.target.value); setSuggestedTime('');}}
              className="col-span-3"
            />
          </div>
          {!existingActivity && suggestedTime && !activityTime && (
             <div className="col-span-4 grid grid-cols-4 items-center gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-3">
                    <Button variant="outline" size="sm" onClick={handleUseSuggestedTime} className="text-xs text-tripcraft-primary border-tripcraft-primary/50 hover:bg-tripcraft-primary/10">
                        <Clock size={14} className="mr-1.5" /> Suggested: {suggestedTime}
                    </Button>
                </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activity-notes" className="text-right col-span-1">
              Notes
            </Label>
            <Textarea
              id="activity-notes"
              value={activityNotes}
              onChange={(e) => setActivityNotes(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Book tickets online"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="bg-tripcraft-accent hover:bg-emerald-600 text-white">
            {existingActivity ? 'Save Changes' : 'Add Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;