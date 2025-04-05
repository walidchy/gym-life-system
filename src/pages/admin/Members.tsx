
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
import { User, Member } from '@/types';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// This would be a real API service in production
const mockMembers = [
  {
    user_id: 1,
    user: { 
      id: 1, 
      name: 'Jane Cooper', 
      email: 'jane@example.com', 
      role: 'member', 
      is_verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Jane+Cooper'
    },
    birth_date: '1990-05-15',
    gender: 'female',
    address: '123 Main St, City',
    phone: '(555) 123-4567',
    membership: { name: 'Premium', end_date: '2024-12-31', is_active: true }
  },
  {
    user_id: 2,
    user: { 
      id: 2, 
      name: 'John Smith', 
      email: 'john@example.com', 
      role: 'member', 
      is_verified: true,
      avatar: 'https://ui-avatars.com/api/?name=John+Smith'
    },
    birth_date: '1985-10-20',
    gender: 'male',
    address: '456 Oak St, Town',
    phone: '(555) 987-6543',
    membership: { name: 'Basic', end_date: '2024-06-30', is_active: true }
  },
  {
    user_id: 3,
    user: { 
      id: 3, 
      name: 'Emily Johnson', 
      email: 'emily@example.com', 
      role: 'member', 
      is_verified: false,
      avatar: 'https://ui-avatars.com/api/?name=Emily+Johnson'
    },
    birth_date: '1993-02-10',
    gender: 'female',
    address: '789 Pine St, Village',
    phone: '(555) 456-7890',
    membership: { name: 'Standard', end_date: '2024-03-15', is_active: false }
  },
];

interface MemberWithUser extends Member {
  user: User;
  membership?: {
    name: string;
    end_date: string;
    is_active: boolean;
  };
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [membershipFilter, setMembershipFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would fetch from an API
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setMembers(mockMembers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMembership = membershipFilter === '' || 
      (member.membership && member.membership.name === membershipFilter);
    
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && member.membership?.is_active) ||
      (statusFilter === 'inactive' && !member.membership?.is_active);
    
    return matchesSearch && matchesMembership && matchesStatus;
  });

  const getMembershipTypes = () => {
    const types = new Set(members
      .filter(member => member.membership)
      .map(member => member.membership!.name));
    return Array.from(types);
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
            <CardDescription>
              A list of all gym members
            </CardDescription>
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
            ) : filteredMembers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Membership</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.user_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.user.avatar} alt={member.user.name} />
                              <AvatarFallback>{member.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.user.name}</div>
                              <div className="text-sm text-muted-foreground">{member.user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.membership?.name || 'No membership'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={member.membership?.is_active ? 'default' : 'secondary'}
                            className={member.membership?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {member.membership?.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.phone || 'Not provided'}</TableCell>
                        <TableCell>3 days ago</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/members/${member.user_id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/members/${member.user_id}/edit`)}
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
                <p className="text-muted-foreground">No members found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Members;
