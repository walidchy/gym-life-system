import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Check,
  Filter,
  Mail,
  Phone,
  Search,
  Shield,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import { getPendingVerifications, verifyUser } from '@/services/admin';
import { User } from '@/types';

const ITEMS_PER_PAGE = 10;

const Verifications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pendingVerifications'],
    queryFn: () => getPendingVerifications(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ userId, verified }: { userId: number; verified: boolean }) => 
      verifyUser(userId, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingVerifications'] });
      toast.success('User verification status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user verification status');
    }
  });

  const users = data?.data || [];

  const filteredUsers = users.filter((user) => {
    const matchesQuery = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleVerify = (userId: number, verified: boolean) => {
    verifyMutation.mutate({ userId, verified });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account Verifications</h1>
            <p className="text-muted-foreground">
              Review and verify user account registrations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-[240px] pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRoleFilter('all')}>All Roles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('member')}>Members</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('trainer')}>Trainers</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter('admin')}>Admins</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <Shield className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending verifications</h3>
              <p className="text-sm text-gray-500 max-w-md">
                There are no users waiting for account verification at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'trainer' ? 'default' : 'secondary'}>
                          {user.role === 'member' ? 'Member' : user.role === 'trainer' ? 'Trainer' : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleVerify(user.id, false)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleVerify(user.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Verification Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Total Pending</h3>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-gray-500">Verification requests</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Members</h3>
                <p className="text-2xl font-bold">
                  {users.filter(user => user.role === 'member').length}
                </p>
                <p className="text-sm text-gray-500">Awaiting verification</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Trainers</h3>
                <p className="text-2xl font-bold">
                  {users.filter(user => user.role === 'trainer').length}
                </p>
                <p className="text-sm text-gray-500">Awaiting verification</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Admins</h3>
                <p className="text-2xl font-bold">
                  {users.filter(user => user.role === 'admin').length}
                </p>
                <p className="text-sm text-gray-500">Awaiting verification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Verifications;
