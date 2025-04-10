import React, { useState, useEffect } from 'react';
import { PlusCircle, Filter, Search, Save, X, Edit, Trash2, Eye } from 'lucide-react';
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
import { getTrainers, deleteTrainer, updateTrainer } from '@/services/trainer';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrainers();
  }, [specializationFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, specializationFilter]);

  const fetchTrainers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (specializationFilter) queryParams.append('specialization', specializationFilter);
      
      const response = await getTrainers(queryParams.toString());
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

  const handleEditClick = (trainer: User) => {
    setEditingId(trainer.id);
    setEditForm({
      name: trainer.name,
      email: trainer.email,
      trainer: {
        specialization: trainer.trainer?.specialization,
        experience_years: trainer.trainer?.experience_years,
        certifications: trainer.trainer?.certifications,
        phone: trainer.trainer?.phone,
        bio: trainer.trainer?.bio
      }
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrainerFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        [name]: name === 'experience_years' ? Number(value) : value
      }
    }));
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const certifications = e.target.value.split(',').map(item => item.trim());
    setEditForm(prev => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        certifications
      }
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    setIsSaving(true);
    try {
      const updatedTrainer = await updateTrainer(editingId, editForm);
      setTrainers(prev => 
        prev.map(trainer => trainer.id === editingId ? updatedTrainer : trainer)
      );
      toast.success('Trainer updated successfully');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating trainer:', error);
      toast.error('Failed to update trainer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
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

  const paginatedTrainers = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);

  const getSpecializations = () => {
    const specializations = new Set(
      trainers.map(trainer => trainer.trainer?.specialization).filter(Boolean)
    );
    return Array.from(specializations);
  };

  const parseCertifications = (certifications: string | string[] | undefined): string => {
    if (!certifications) return '-';
    
    if (Array.isArray(certifications)) {
      return certifications.join(', ');
    }
    
    try {
      const parsed = JSON.parse(certifications as string);
      return Array.isArray(parsed) ? parsed.join(', ') : String(certifications);
    } catch {
      return String(certifications);
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
              <>
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
                      {paginatedTrainers.map((trainer) => (
                        <React.Fragment key={trainer.id}>
                          {editingId === trainer.id ? (
                            <TableRow className="bg-accent/50">
                              <TableCell>
                                <Input
                                  name="name"
                                  value={editForm.name || ''}
                                  onChange={handleEditFormChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="email"
                                  value={editForm.email || ''}
                                  onChange={handleEditFormChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="specialization"
                                  value={editForm.trainer?.specialization || ''}
                                  onChange={handleTrainerFieldChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="experience_years"
                                  type="number"
                                  value={editForm.trainer?.experience_years || 0}
                                  onChange={handleTrainerFieldChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={Array.isArray(editForm.trainer?.certifications) ? 
                                    editForm.trainer.certifications.join(', ') : 
                                    parseCertifications(editForm.trainer?.certifications)}
                                  onChange={handleCertificationsChange}
                                  className="w-full"
                                  placeholder="Comma separated certifications"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  name="phone"
                                  value={editForm.trainer?.phone || ''}
                                  onChange={handleTrainerFieldChange}
                                  className="w-full"
                                />
                              </TableCell>
                              <TableCell>
                                {trainer.active_members || 0}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleSaveEdit}
                                  disabled={isSaving}
                                >
                                  {isSaving ? (
                                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <Save className="h-4 w-4 mr-1" />
                                  )}
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  disabled={isSaving}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
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
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditClick(trainer)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteTrainer(trainer.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={index + 1 === currentPage ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
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