import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMembers, deleteMember } from '@/services/members';
import { Member, Membership } from '@/types';

// Define a separate interface for the member's membership which has a different structure
interface MemberMembership {
  id: number;
  name: string;
  is_active: boolean;
  end_date: string;
  membership_plan?: {
    name: string;
  };
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Set items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  const handleDeleteMember = async (memberId: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(memberId);
        setMembers(prev => prev.filter(member => member.id !== memberId));
        toast.success('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        toast.error('Failed to delete member. They may have existing bookings or payments.');
      }
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasActiveMembership = member.memberships?.some(m => m.is_active);
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && hasActiveMembership) ||
      (statusFilter === 'inactive' && !hasActiveMembership);
    
    return matchesSearch && matchesStatus;
  });

  // Paginate filtered members
  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  const getLatestMembership = (memberships?: MemberMembership[]) => {
    if (!memberships || memberships.length === 0) return null;
    return [...memberships].sort((a, b) => 
      new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
    )[0];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Members Management</h1>
            <p className="text-muted-foreground">Manage gym members and their profiles</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/members/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Members</CardTitle>
            <CardDescription>A list of all gym members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={statusFilter === '' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('')}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'active' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('active')}
                  size="sm"
                >
                  Active
                </Button>
                <Button 
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
                  onClick={() => setStatusFilter('inactive')}
                  size="sm"
                >
                  Inactive
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : currentMembers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Membership</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Membership End</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMembers.map((member) => {
                      const latestMembership = getLatestMembership(member.memberships);
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>
                                  {member.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {latestMembership?.membership_plan?.name || 'No membership'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={latestMembership?.is_active ? 'default' : 'secondary'}
                              className={latestMembership?.is_active ? 
                                'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {latestMembership?.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.phone || 'Not provided'}</TableCell>
                          <TableCell>
                            {latestMembership?.end_date ? 
                              new Date(latestMembership.end_date).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate(`/admin/members/${member.id}`)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => navigate(`/admin/members/${member.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No members found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Refresh List
                </Button>
              </div>
            )}
            
            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-4">
              <Button 
                variant="outline" 
                disabled={currentPage === 1} 
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </Button>
              <Button 
                variant="outline" 
                disabled={currentPage === Math.ceil(filteredMembers.length / itemsPerPage)} 
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Members;
