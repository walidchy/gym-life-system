import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Activity } from '@/types';
import { getActivities, deleteActivity } from '@/services/activities';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, [categoryFilter, difficultyFilter]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (categoryFilter) queryParams.append('category', categoryFilter);
      if (difficultyFilter) queryParams.append('difficulty_level', difficultyFilter);

      const data = await getActivities(queryParams.toString());
      setActivities(data || []);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(id);
        setActivities(prev => prev.filter(activity => activity.id !== id));
        toast.success('Activity deleted successfully');
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast.error('Failed to delete activity. It may have existing bookings.');
      }
    }
  };

  const filteredActivities = activities.filter(activity => {
    const searchLower = searchQuery.toLowerCase();
    return (
      activity.name.toLowerCase().includes(searchLower) ||
      activity.description.toLowerCase().includes(searchLower) ||
      activity.location.toLowerCase().includes(searchLower) ||
      (activity.trainer?.name || '').toLowerCase().includes(searchLower)
    );
  });

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const getCategories = () => {
    const categories = new Set(activities.map(activity => activity.category));
    return Array.from(categories);
  };

  const getDifficultyLevels = () => {
    const levels = new Set(activities.map(activity => activity.difficulty_level));
    return Array.from(levels);
  };

  const parseEquipment = (equipment: string | string[] | undefined): string => {
    if (!equipment) return '';
    if (Array.isArray(equipment)) {
      return equipment.join(', ');
    }
    try {
      const parsed = JSON.parse(equipment);
      return Array.isArray(parsed) ? parsed.join(', ') : equipment.toString();
    } catch {
      return equipment.toString();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Activities Management</h1>
            <p className="text-muted-foreground">Manage all gym activities and classes</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/activities/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Activity
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Activities</CardTitle>
            <CardDescription>A list of all activities offered at the gym</CardDescription>
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
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter('')}>All Categories</DropdownMenuItem>
                    {getCategories().map(category => (
                      <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Difficulty
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setDifficultyFilter('')}>All Levels</DropdownMenuItem>
                    {getDifficultyLevels().map(level => (
                      <DropdownMenuItem key={level} onClick={() => setDifficultyFilter(level)}>
                        {level}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : filteredActivities.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Equipment</TableHead>
                        <TableHead>Trainer</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">{activity.name}</TableCell>
                          <TableCell>{activity.category}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                activity.difficulty_level === 'beginner' ? 'outline' :
                                activity.difficulty_level === 'intermediate' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {activity.difficulty_level}
                            </Badge>
                          </TableCell>
                          <TableCell>{activity.duration_minutes} min</TableCell>
                          <TableCell>{activity.location}</TableCell>
                          <TableCell>{parseEquipment(activity.equipment_needed)}</TableCell>
                          <TableCell>{activity.trainer?.name || 'No trainer assigned'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/activities/${activity.id}`)}>View</Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/activities/${activity.id}/edit`)}>Edit</Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-4 space-x-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No activities found.</p>
                <Button variant="outline" className="mt-4" onClick={fetchActivities}>
                  Refresh List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Activities;
