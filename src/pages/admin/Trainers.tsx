
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Trainer } from '@/types';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This would be a real API service in production
const mockTrainers = [
  {
    user_id: 4,
    user: { 
      id: 4, 
      name: 'Alex Bennett', 
      email: 'alex@example.com', 
      role: 'trainer', 
      is_verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Alex+Bennett'
    },
    specialization: 'Strength Training',
    bio: 'Certified personal trainer with 5+ years experience in strength training and muscle building.',
    experience_years: 5,
    certifications: ['NASM CPT', 'ACE', 'Strength & Conditioning Specialist'],
    phone: '(555) 123-7890',
    active_clients: 12
  },
  {
    user_id: 5,
    user: { 
      id: 5, 
      name: 'Sarah Miller', 
      email: 'sarah@example.com', 
      role: 'trainer', 
      is_verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller'
    },
    specialization: 'Yoga & Pilates',
    bio: 'Experienced yoga instructor specializing in vinyasa flow and power yoga for all levels.',
    experience_years: 8,
    certifications: ['RYT 200', 'Pilates Certification'],
    phone: '(555) 234-5678',
    active_clients: 15
  },
  {
    user_id: 6,
    user: { 
      id: 6, 
      name: 'Michael Chen', 
      email: 'michael@example.com', 
      role: 'trainer', 
      is_verified: false,
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen'
    },
    specialization: 'Cardio & HIIT',
    bio: 'Fitness coach focused on high-intensity workouts and functional training.',
    experience_years: 3,
    certifications: ['ACSM', 'CrossFit Level 1'],
    phone: '(555) 345-6789',
    active_clients: 8
  },
];

interface TrainerWithUser extends Trainer {
  user: User;
  active_clients?: number;
}

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would fetch from an API
    const fetchTrainers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setTrainers(mockTrainers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching trainers:', error);
        toast.error('Failed to load trainers');
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = 
      trainer.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trainer.specialization && trainer.specialization.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialization = specializationFilter === '' || 
      (trainer.specialization && trainer.specialization === specializationFilter);
    
    return matchesSearch && matchesSpecialization;
  });

  const getSpecializations = () => {
    const specs = new Set(trainers
      .filter(trainer => trainer.specialization)
      .map(trainer => trainer.specialization!));
    return Array.from(specs);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trainers Management</h1>
            <p className="text-muted-foreground">Manage gym trainers and their profiles</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/trainers/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Trainer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trainers</CardTitle>
            <CardDescription>
              A list of all gym trainers and instructors
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
              <div className="flex">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {getSpecializations().map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
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
                      <TableHead>Trainer</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Active Clients</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTrainers.map((trainer) => (
                      <TableRow key={trainer.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={trainer.user.avatar} alt={trainer.user.name} />
                              <AvatarFallback>{trainer.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{trainer.user.name}</div>
                              <div className="text-sm text-muted-foreground">{trainer.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{trainer.specialization || 'Not specified'}</TableCell>
                        <TableCell>{trainer.experience_years} years</TableCell>
                        <TableCell>
                          <Badge 
                            variant={trainer.user.is_verified ? 'default' : 'secondary'}
                            className={trainer.user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {trainer.user.is_verified ? 'Active' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{trainer.active_clients || 0}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/trainers/${trainer.user_id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/trainers/${trainer.user_id}/edit`)}
                          >
                            Edit
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Trainers;
