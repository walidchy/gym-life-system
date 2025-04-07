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
import { Membership } from '@/types';
import { getMemberships, deleteMembership } from '@/services/membership';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout'; // Make sure this path is correct

const Memberships: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemberships();
  }, [statusFilter]);

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

  const filteredMemberships = memberships.filter(membership => {
    const searchLower = searchQuery.toLowerCase();
    return (
      membership.name.toLowerCase().includes(searchLower) ||
      membership.description.toLowerCase().includes(searchLower) ||
      membership.category?.toLowerCase().includes(searchLower)
    );
  });

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
            <CardDescription>
              A list of all memberships available at the gym
            </CardDescription>
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
                    <DropdownMenuItem onClick={() => setStatusFilter('')}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('true')}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('false')}>
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : filteredMemberships.length > 0 ? (
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
                    {filteredMemberships.map((membership) => (
                      <TableRow key={membership.id}>
                        <TableCell className="font-medium">{membership.name}</TableCell>
                        <TableCell>{formatPrice(membership.price)}</TableCell>
                        <TableCell>{Math.floor(membership.duration_days / 30)} months</TableCell>
                        <TableCell>{getStatusBadge(membership.is_active)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {Array.isArray(membership.features) ? membership.features.join(', ') : ''}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/memberships/${membership.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/memberships/${membership.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteMembership(membership.id)}
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
                <p className="text-muted-foreground">No memberships found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={fetchMemberships}
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

export default Memberships;