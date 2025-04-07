
import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingActivities } from '@/services/activities';

const MemberActivities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch activities with React Query
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities', 'upcoming'],
    queryFn: getUpcomingActivities
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || 
      activity.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getCategories = () => {
    const categories = new Set(activities.map(activity => activity.category));
    return Array.from(categories);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gym Activities</h1>
            <p className="text-muted-foreground">Browse and book activities at our gym</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <a href="#classes">View Schedule</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Activities</CardTitle>
            <CardDescription>
              Browse our selection of fitness classes and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={categoryFilter === '' ? 'default' : 'outline'} 
                  onClick={() => setCategoryFilter('')}
                  size="sm"
                >
                  All
                </Button>
                {getCategories().map(category => (
                  <Button 
                    key={category}
                    variant={categoryFilter === category ? 'default' : 'outline'} 
                    onClick={() => setCategoryFilter(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {activity.location ? (
                        <img 
                          src={`/images/${activity.category.toLowerCase()}.jpg`} 
                          alt={activity.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">
                        {activity.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{activity.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {activity.description?.substring(0, 100)}
                        {activity.description && activity.description.length > 100 ? '...' : ''}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          {activity.duration_minutes} mins • {activity.difficulty_level}
                        </div>
                        <Button size="sm" asChild>
                          <a href={`/activities/${activity.id}`}>Details</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No activities found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MemberActivities;
