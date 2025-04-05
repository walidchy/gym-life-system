
import React, { useEffect, useState } from 'react';
import { Calendar, Activity, CreditCard, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Booking, Activity as ActivityType, Membership } from '@/types';
import { getMemberBookings } from '@/services/members';
import { getCurrentMembership } from '@/services/membership';
import { getUpcomingActivities } from '@/services/activities';
import { Link } from 'react-router-dom';

const MemberDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch data in parallel
        const [bookingsData, membershipData, activitiesData] = await Promise.all([
          getMemberBookings(),
          getCurrentMembership().catch(() => null),
          getUpcomingActivities()
        ]);
        
        setBookings(bookingsData);
        setMembership(membershipData);
        setUpcomingActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate days remaining in membership
  const getDaysRemaining = () => {
    if (!membership) return 0;
    
    const endDate = new Date(membership.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();
  const totalDays = membership?.membership_plan?.duration_days || 30; // Fallback to 30 days
  const percentRemaining = Math.round((daysRemaining / totalDays) * 100);
  
  // Format date from ISO to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Member Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your fitness journey.</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link to="/activities">Browse Classes</Link>
          </Button>
          <Button asChild>
            <Link to="/bookings/new">Book Activity</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                bookings.filter(b => b.status === 'upcoming').length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Classes you've scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Stats</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                bookings.filter(b => b.status === 'completed').length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Completed activities this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div> : 
                membership?.membership_plan?.name || 'No active plan'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {membership?.is_active ? 'Active membership' : 'Inactive'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? 
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : 
                daysRemaining
              }
            </div>
            <Progress value={percentRemaining} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {percentRemaining}% of membership remaining
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next scheduled activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center p-3 h-16 rounded-md bg-gray-100 animate-pulse">
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bookings.filter(b => b.status === 'upcoming').length > 0 ? (
              <div className="space-y-4">
                {bookings
                  .filter(b => b.status === 'upcoming')
                  .slice(0, 5)
                  .map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="bg-gym-secondary text-white p-2 rounded mr-3">
                          <Dumbbell className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{booking.activity?.name}</h4>
                          <p className="text-sm text-gray-500">{formatDate(booking.date)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/bookings/${booking.id}`}>
                          <span className="sr-only">View booking</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No upcoming bookings.</p>
                <Button asChild className="mt-4">
                  <Link to="/activities">Browse Activities</Link>
                </Button>
              </div>
            )}
            
            {bookings.filter(b => b.status === 'upcoming').length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="link" asChild>
                  <Link to="/bookings">View all bookings</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>Activities you might enjoy</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center p-3 h-16 rounded-md bg-gray-100 animate-pulse">
                    <div className="w-full">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingActivities.length > 0 ? (
              <div className="space-y-3">
                {upcomingActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="h-10 w-10 rounded bg-gym-primary/10 text-gym-primary flex items-center justify-center mr-3">
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.name}</h4>
                      <p className="text-xs text-gray-500">
                        {activity.difficulty_level} · {activity.duration_minutes} min
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/activities/${activity.id}`}>
                        Details
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activities available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Details about your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-32 bg-gray-100 animate-pulse rounded-md"></div>
          ) : membership ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Current Plan</h3>
                <p className="text-xl font-bold">{membership.membership_plan?.name}</p>
                <p className="text-sm">{membership.membership_plan?.description}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p className="text-lg">
                  <span className="font-bold">{formatDate(membership.start_date)}</span>
                  <span className="mx-2 text-gray-400">to</span>
                  <span className="font-bold">{formatDate(membership.end_date)}</span>
                </p>
                <div className="flex items-center">
                  <Progress value={percentRemaining} className="h-2 flex-1" />
                  <span className="ml-2 text-sm">{daysRemaining} days left</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Features</h3>
                {membership.membership_plan?.features && (
                  <ul className="text-sm space-y-1">
                    {membership.membership_plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <Button asChild className="mt-4">
                  <Link to="/membership">Manage Membership</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">No Active Membership</h3>
              <p className="text-muted-foreground mb-4">Subscribe to a membership plan to access premium features.</p>
              <Button asChild>
                <Link to="/membership/plans">View Membership Plans</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDashboard;
