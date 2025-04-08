
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import { getTrainerSchedule } from '@/services/trainer';

const TrainerSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['trainerSchedule', format(startOfCurrentWeek, 'yyyy-MM-dd')],
    queryFn: () => getTrainerSchedule(),
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
  
  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const getScheduleForDay = (dayName: string) => {
    return schedule.filter((item) => item.day_of_week === dayName);
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
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
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
    </MainLayout>
  );
};

export default TrainerSchedule;
