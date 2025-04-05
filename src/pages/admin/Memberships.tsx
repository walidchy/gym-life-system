
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { MembershipPlan } from '@/types';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

// This would be a real API service in production
const mockMemberships: MembershipPlan[] = [
  {
    id: 1,
    name: 'Basic',
    description: 'Access to basic gym facilities and classes',
    price: 29.99,
    duration_days: 30,
    features: [
      'Access to gym facilities',
      'Standard equipment usage',
      '2 group classes per week',
      'Locker access'
    ],
    is_active: true
  },
  {
    id: 2,
    name: 'Standard',
    description: 'Extended access with more classes and amenities',
    price: 49.99,
    duration_days: 30,
    features: [
      'Access to gym facilities',
      'All equipment usage',
      'Unlimited group classes',
      'Locker access',
      'Towel service'
    ],
    is_active: true
  },
  {
    id: 3,
    name: 'Premium',
    description: 'Full access to all facilities and services',
    price: 79.99,
    duration_days: 30,
    features: [
      'Access to gym facilities',
      'All equipment usage',
      'Unlimited group classes',
      'Locker access',
      'Towel service',
      'Personal trainer session (1x per month)',
      'Sauna & spa access',
      'Nutritional consultation'
    ],
    is_active: true
  },
  {
    id: 4,
    name: 'Family',
    description: 'Membership for up to 4 family members',
    price: 149.99,
    duration_days: 30,
    features: [
      'Access for 4 family members',
      'All equipment usage',
      'Unlimited group classes',
      'Locker access',
      'Towel service',
      'Childcare services'
    ],
    is_active: false
  },
  {
    id: 5,
    name: 'Annual Basic',
    description: 'Basic plan with annual payment discount',
    price: 299.99,
    duration_days: 365,
    features: [
      'Access to gym facilities',
      'Standard equipment usage',
      '2 group classes per week',
      'Locker access',
      '15% discount on annual payment'
    ],
    is_active: true
  }
];

const Memberships: React.FC = () => {
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would fetch from an API
    const fetchMemberships = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setMemberships(mockMemberships);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching memberships:', error);
        toast.error('Failed to load membership plans');
        setIsLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const toggleMembershipStatus = (id: number) => {
    setMemberships(memberships.map(membership => 
      membership.id === id 
        ? { ...membership, is_active: !membership.is_active } 
        : membership
    ));
    
    toast.success(`Membership status updated successfully`);
  };

  const handleDeleteMembership = (id: number) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      setMemberships(memberships.filter(membership => membership.id !== id));
      toast.success('Membership plan deleted successfully');
    }
  };

  const filteredMemberships = memberships.filter(membership => 
    membership.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    membership.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Membership Plans</h1>
            <p className="text-muted-foreground">Manage gym membership plans and pricing</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/memberships/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Membership Plan
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Membership Plans</CardTitle>
            <CardDescription>
              Manage available membership plans and their features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative flex-1 mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      <TableHead>Features</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMemberships.map((membership) => (
                      <TableRow key={membership.id}>
                        <TableCell>
                          <div className="font-medium">{membership.name}</div>
                          <div className="text-sm text-muted-foreground">{membership.description}</div>
                        </TableCell>
                        <TableCell>${membership.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {membership.duration_days === 30 
                            ? 'Monthly' 
                            : membership.duration_days === 365 
                              ? 'Annual' 
                              : `${membership.duration_days} days`}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{membership.features.length} features</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={membership.is_active}
                              onCheckedChange={() => toggleMembershipStatus(membership.id)}
                            />
                            <span className={membership.is_active ? 'text-green-600' : 'text-gray-500'}>
                              {membership.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/memberships/${membership.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteMembership(membership.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
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
                <p className="text-muted-foreground">No membership plans found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Memberships;
