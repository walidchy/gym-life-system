
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Plus, 
  Edit,
  Trash,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { getTrainerSchedule, addTrainerScheduleItem, updateTrainerScheduleItem, deleteTrainerScheduleItem } from '@/services/trainer';
import { ActivitySchedule } from '@/types';

const TrainerSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const queryClient = useQueryClient();
  
  // Schedule state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any>(null);
  const [scheduleForm, setScheduleForm] = useState({
    activity_name: '',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:00',
    location: '',
    max_participants: 15
  });
  
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['trainerSchedule', format(startOfCurrentWeek, 'yyyy-MM-dd')],
    queryFn: () => getTrainerSchedule(),
  });

  // Add schedule mutation
  const addScheduleMutation = useMutation({
    mutationFn: (data: Partial<ActivitySchedule>) => addTrainerScheduleItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerSchedule'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Class added to schedule successfully');
    },
    onError: () => {
      toast.error('Failed to add class to schedule');
    }
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActivitySchedule> }) => updateTrainerScheduleItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerSchedule'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Schedule updated successfully');
    },
    onError: () => {
      toast.error('Failed to update schedule');
    }
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => deleteTrainerScheduleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainerSchedule'] });
      setIsDeleteDialogOpen(false);
      toast.success('Class removed from schedule');
    },
    onError: () => {
      toast.error('Failed to delete class from schedule');
    }
  });

  // Mock data for demonstration
  const demoSchedule = [
    {
      id: 1,
      activity_name: 'HIIT Training',
      start_time: '09:00',
      end_time: '10:00',
      day_of_week: 'Monday',
      location: 'Studio A',
      participants: 12,
      max_participants: 15,
    },
    {
      id: 2,
      activity_name: 'Yoga Basics',
      start_time: '14:30',
      end_time: '15:30',
      day_of_week: 'Monday',
      location: 'Studio B',
      participants: 8,
      max_participants: 12,
    },
    {
      id: 3,
      activity_name: 'Strength Training',
      start_time: '11:00',
      end_time: '12:00',
      day_of_week: 'Tuesday',
      location: 'Main Floor',
      participants: 15,
      max_participants: 15,
    },
    {
      id: 4,
      activity_name: 'Spin Class',
      start_time: '17:00',
      end_time: '18:00',
      day_of_week: 'Wednesday',
      location: 'Cycling Studio',
      participants: 10,
      max_participants: 20,
    },
    {
      id: 5,
      activity_name: 'Core Conditioning',
      start_time: '13:00',
      end_time: '14:00',
      day_of_week: 'Thursday',
      location: 'Studio A',
      participants: 7,
      max_participants: 15,
    },
    {
      id: 6,
      activity_name: 'Bootcamp',
      start_time: '09:30',
      end_time: '10:30',
      day_of_week: 'Friday',
      location: 'Outdoor Area',
      participants: 18,
      max_participants: 20,
    },
  ];
  
  // We would normally use the fetched data, but for demo purposes, we'll use the mock data
  const schedule = scheduleData?.data || demoSchedule;
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfCurrentWeek, i);
    return {
      date: day,
      dayName: format(day, 'EEEE'),
      dayNumber: format(day, 'd'),
      month: format(day, 'MMM'),
      isToday: isSameDay(day, new Date()),
    };
  });

  const resetForm = () => {
    setScheduleForm({
      activity_name: '',
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '10:00',
      location: '',
      max_participants: 15
    });
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const getScheduleForDay = (dayName: string) => {
    return schedule.filter((item) => item.day_of_week === dayName);
  };

  const handleAddSchedule = () => {
    // In a real app, you'd validate the form data here
    addScheduleMutation.mutate({
      ...scheduleForm,
      max_participants: Number(scheduleForm.max_participants)
    });
  };

  const handleEditSchedule = () => {
    if (!selectedScheduleItem) return;
    
    updateScheduleMutation.mutate({
      id: selectedScheduleItem.id,
      data: {
        ...scheduleForm,
        max_participants: Number(scheduleForm.max_participants)
      }
    });
  };

  const handleDeleteSchedule = () => {
    if (!selectedScheduleItem) return;
    deleteScheduleMutation.mutate(selectedScheduleItem.id);
  };

  const openEditDialog = (item: any) => {
    setSelectedScheduleItem(item);
    setScheduleForm({
      activity_name: item.activity_name,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      location: item.location,
      max_participants: item.max_participants
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (item: any) => {
    setSelectedScheduleItem(item);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
            <p className="text-muted-foreground">View and manage your weekly training schedule</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
              </span>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Class
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div key={day.dayName} className="flex flex-col">
                <div className={`text-center p-2 rounded-t-md ${
                  day.isToday ? 'bg-gym-secondary text-white' : 'bg-gray-100'
                }`}>
                  <div className="font-medium">{day.dayName}</div>
                  <div className="text-xs">
                    {day.month} {day.dayNumber}
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-b-md border overflow-y-auto max-h-[500px]">
                  {getScheduleForDay(day.dayName).length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No activities</div>
                  ) : (
                    getScheduleForDay(day.dayName).map((item) => (
                      <div 
                        key={item.id} 
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors relative group"
                      >
                        <div className="absolute right-2 top-2 hidden group-hover:flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(item)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => openDeleteDialog(item)}>
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                        <h4 className="font-medium truncate">{item.activity_name}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          <span>
                            {item.participants}/{item.max_participants} participants
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.location}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">This Week</h3>
                <p className="text-2xl font-bold">{schedule.length} Classes</p>
                <p className="text-sm text-gray-500">Total scheduled activities</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Busiest Day</h3>
                <p className="text-2xl font-bold">Monday</p>
                <p className="text-sm text-gray-500">2 classes scheduled</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Participants</h3>
                <p className="text-2xl font-bold">70 / 97</p>
                <p className="text-sm text-gray-500">Total participants / capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Schedule Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Add a new class to your weekly schedule.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="activity_name">Class Name</Label>
              <Input
                id="activity_name"
                value={scheduleForm.activity_name}
                onChange={(e) => setScheduleForm({ ...scheduleForm, activity_name: e.target.value })}
                placeholder="e.g. HIIT Training"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="day_of_week">Day of Week</Label>
              <Select 
                value={scheduleForm.day_of_week} 
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, day_of_week: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                placeholder="e.g. Studio A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                value={scheduleForm.max_participants}
                onChange={(e) => setScheduleForm({ ...scheduleForm, max_participants: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSchedule} disabled={addScheduleMutation.isPending}>
              {addScheduleMutation.isPending ? "Adding..." : "Add Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update the details of this class.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_activity_name">Class Name</Label>
              <Input
                id="edit_activity_name"
                value={scheduleForm.activity_name}
                onChange={(e) => setScheduleForm({ ...scheduleForm, activity_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_day_of_week">Day of Week</Label>
              <Select 
                value={scheduleForm.day_of_week} 
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, day_of_week: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_time">Start Time</Label>
                <Input
                  id="edit_start_time"
                  type="time"
                  value={scheduleForm.start_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_time">End Time</Label>
                <Input
                  id="edit_end_time"
                  type="time"
                  value={scheduleForm.end_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_location">Location</Label>
              <Input
                id="edit_location"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_max_participants">Max Participants</Label>
              <Input
                id="edit_max_participants"
                type="number"
                value={scheduleForm.max_participants}
                onChange={(e) => setScheduleForm({ ...scheduleForm, max_participants: parseInt(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSchedule} disabled={updateScheduleMutation.isPending}>
              {updateScheduleMutation.isPending ? "Updating..." : "Update Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this class from your schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedScheduleItem && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium">{selectedScheduleItem.activity_name}</h4>
                <p className="text-sm text-gray-500">{selectedScheduleItem.day_of_week}, {selectedScheduleItem.start_time} - {selectedScheduleItem.end_time}</p>
                <p className="text-sm text-gray-500">{selectedScheduleItem.location}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSchedule} disabled={deleteScheduleMutation.isPending}>
              {deleteScheduleMutation.isPending ? "Deleting..." : "Delete Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TrainerSchedule;
