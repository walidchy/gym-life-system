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
import { toast } from 'sonner';
import { User } from '@/types';
import { getTrainers, deleteTrainer } from '@/services/trainers';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, [specializationFilter]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (specializationFilter) queryParams.append('specialization', specializationFilter);
      
      const response = await getTrainers(queryParams.toString());
      // Ensure we're properly extracting the array from the response
      setTrainers(response?.data || []);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      toast.error('Failed to load trainers');
      setTrainers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrainer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await deleteTrainer(id);
        setTrainers(prev => prev.filter(trainer => trainer.id !== id));
        toast.success('Trainer deleted successfully');
      } catch (error) {
        console.error('Error deleting trainer:', error);
        toast.error('Failed to delete trainer. They may have associated activities.');
      }
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      trainer.name.toLowerCase().includes(searchLower) ||
      trainer.email.toLowerCase().includes(searchLower) ||
      trainer.trainer?.specialization?.toLowerCase().includes(searchLower) ||
      trainer.trainer?.bio?.toLowerCase().includes(searchLower)
    );
  });

  const getSpecializations = () => {
    const specializations = new Set(
      trainers.map(trainer => trainer.trainer?.specialization).filter(Boolean)
    );
    return Array.from(specializations);
  };

  const parseCertifications = (certifications: string) => {
    try {
      return JSON.parse(certifications).join(', ');
    } catch {
      return certifications;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trainers Management</h1>
            <p className="text-muted-foreground">Manage all gym trainers and their profiles</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/trainers/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Trainer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trainers</CardTitle>
            <CardDescription>
              A list of all certified trainers working at the gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trainers..."
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
                      Specialization
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSpecializationFilter('')}>
                      All Specializations
                    </DropdownMenuItem>
                    {getSpecializations().map(specialization => (
                      <DropdownMenuItem 
                        key={specialization} 
                        onClick={() => setSpecializationFilter(specialization)}
                      >
                        {specialization}
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
            ) : filteredTrainers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Active Members</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainers.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell className="font-medium">{trainer.name}</TableCell>
                        <TableCell>{trainer.email}</TableCell>
                        <TableCell>{trainer.trainer?.specialization || '-'}</TableCell>
                        <TableCell>{trainer.trainer?.experience_years} years</TableCell>
                        <TableCell>
                          {trainer.trainer?.certifications ? 
                            parseCertifications(trainer.trainer.certifications) : '-'}
                        </TableCell>
                        <TableCell>{trainer.trainer?.phone || '-'}</TableCell>
                        <TableCell>{trainer.active_members || 0}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/trainers/${trainer.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/trainers/${trainer.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteTrainer(trainer.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No trainers found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={fetchTrainers}
                >
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

export default Trainers;