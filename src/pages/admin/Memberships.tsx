import React, { useState, useEffect } from 'react';
import {
  PlusCircle, Filter, Search, Save, X, Edit, Trash2, Eye, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Membership } from '@/types';
import { getMemberships, deleteMembership, updateMembership } from '@/services/membership';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const Memberships: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Membership>>({});
  const [isSaving, setIsSaving] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberships();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const fetchMemberships = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('is_active', statusFilter);
      const data = await getMemberships(queryParams.toString());
      setMemberships(data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      toast.error('Failed to load memberships');
      setMemberships([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMembership = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        await deleteMembership(id);
        setMemberships(prev => prev.filter(m => m.id !== id));
        toast.success('Membership deleted successfully');
      } catch (error) {
        console.error('Error deleting membership:', error);
        toast.error('Failed to delete membership');
      }
    }
  };

  const handleEditClick = (membership: Membership) => {
    setEditingId(membership.id);
    setEditForm({
      name: membership.name,
      price: membership.price,
      duration_days: membership.duration_days,
      is_active: membership.is_active,
      features: membership.features,
      description: membership.description
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration_days' ? Number(value) : value
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(',').map(f => f.trim());
    setEditForm(prev => ({ ...prev, features }));
  };

  const handleStatusChange = (isActive: boolean) => {
    setEditForm(prev => ({ ...prev, is_active: isActive }));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setIsSaving(true);
    try {
      const updatedMembership = await updateMembership(editingId, editForm);
      setMemberships(prev =>
        prev.map(m => (m.id === editingId ? updatedMembership : m))
      );
      toast.success('Membership updated successfully');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating membership:', error);
      toast.error('Failed to update membership');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const filteredMemberships = memberships.filter(m => {
    const searchLower = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(searchLower) ||
      m.description.toLowerCase().includes(searchLower) ||
      m.category?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredMemberships.length / itemsPerPage);
  const paginatedMemberships = filteredMemberships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? 'default' : 'destructive'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Membership Management</h1>
            <p className="text-muted-foreground">Manage all gym memberships</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/memberships/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Membership
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Memberships</CardTitle>
            <CardDescription>A list of all memberships available at the gym</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memberships..."
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
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter('')}>All Statuses</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('true')}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('false')}>Inactive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : paginatedMemberships.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMemberships.map((membership) => (
                      <React.Fragment key={membership.id}>
                        {editingId === membership.id ? (
                          <TableRow className="bg-accent/50">
                            <TableCell>
                              <Input name="name" value={editForm.name || ''} onChange={handleEditFormChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="price" type="number" value={editForm.price || 0} onChange={handleEditFormChange} />
                            </TableCell>
                            <TableCell>
                              <Input name="duration_days" type="number" value={editForm.duration_days || 0} onChange={handleEditFormChange} />
                              <span className="text-sm text-muted-foreground ml-2">
                                ({Math.floor((editForm.duration_days || 0) / 30)} months)
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant={editForm.is_active ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleStatusChange(true)}
                                >
                                  Active
                                </Button>
                                <Button
                                  variant={!editForm.is_active ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleStatusChange(false)}
                                >
                                  Inactive
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                value={Array.isArray(editForm.features) ? editForm.features.join(', ') : ''}
                                onChange={handleFeaturesChange}
                                placeholder="Comma separated features"
                              />
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="outline" size="sm" onClick={handleSaveEdit} disabled={isSaving}>
                                {isSaving ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                                Save
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell className="font-medium">{membership.name}</TableCell>
                            <TableCell>{formatPrice(membership.price)}</TableCell>
                            <TableCell>{Math.floor(membership.duration_days / 30)} months</TableCell>
                            <TableCell>{getStatusBadge(membership.is_active)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {Array.isArray(membership.features) ? membership.features.join(', ') : ''}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/memberships/${membership.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditClick(membership)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteMembership(membership.id)}
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
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No memberships found.</p>
                <Button variant="outline" className="mt-4" onClick={fetchMemberships}>
                  Refresh List
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Memberships;
