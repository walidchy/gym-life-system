
import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMemberBookings, cancelBooking } from '@/services/members';

const MemberBookings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const queryClient = useQueryClient();

  // Fetch bookings with React Query
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', 'member'],
    queryFn: getMemberBookings
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'member'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.activity?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      (activeTab === 'upcoming' && booking.status === 'upcoming') ||
      (activeTab === 'past' && booking.status === 'completed') ||
      (activeTab === 'cancelled' && booking.status === 'canceled');
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCancelBooking = (bookingId: number) => {
    cancelBookingMutation.mutate(bookingId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground">Manage your class and activity bookings</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <a href="/activities">Book New Activity</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              View and manage your scheduled activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full md:w-auto grid-cols-3">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookings..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
                </div>
              ) : filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-md border bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex items-center space-x-4 mb-3 md:mb-0">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.activity?.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(booking.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                        <Badge 
                          variant={
                            booking.status === 'upcoming' 
                              ? 'default' 
                              : booking.status === 'completed' 
                                ? 'secondary' 
                                : 'destructive'
                          }
                          className={
                            booking.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800' 
                              : booking.status === 'completed' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800' 
                                : 'bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800'
                          }
                        >
                          {booking.status === 'upcoming' ? 'Upcoming' : booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </Badge>
                        {booking.status === 'upcoming' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelBookingMutation.isPending}
                          >
                            {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/bookings/${booking.id}`}>Details</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No bookings found.</p>
                  <Button asChild>
                    <a href="/activities">Browse Activities</a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MemberBookings;
