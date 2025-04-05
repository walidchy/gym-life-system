
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, AlertTriangle } from 'lucide-react';
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
import { Equipment as EquipmentType } from '@/types';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

// This would be a real API service in production
const mockEquipment: EquipmentType[] = [
  {
    id: 1,
    name: 'Treadmill - TechnoGym',
    description: 'Commercial grade treadmill with 15% incline capability',
    category: 'Cardio',
    quantity: 8,
    purchase_date: '2023-04-15',
    maintenance_date: '2024-01-10',
    status: 'available'
  },
  {
    id: 2,
    name: 'Dumbbells Set (5-50 lbs)',
    description: 'Complete set of rubber hex dumbbells from 5 to 50 pounds',
    category: 'Strength',
    quantity: 10,
    purchase_date: '2022-06-20',
    maintenance_date: null,
    status: 'available'
  },
  {
    id: 3,
    name: 'Smith Machine',
    description: 'Commercial Smith machine with safety stops',
    category: 'Strength',
    quantity: 2,
    purchase_date: '2022-03-10',
    maintenance_date: '2023-12-05',
    status: 'maintenance'
  },
  {
    id: 4,
    name: 'Exercise Bike - Assault AirBike',
    description: 'Air resistance exercise bike',
    category: 'Cardio',
    quantity: 6,
    purchase_date: '2023-01-05',
    maintenance_date: null,
    status: 'in_use'
  },
  {
    id: 5,
    name: 'Yoga Mats',
    description: 'Premium non-slip yoga mats',
    category: 'Accessories',
    quantity: 30,
    purchase_date: '2023-07-12',
    maintenance_date: null,
    status: 'available'
  },
  {
    id: 6,
    name: 'Elliptical Trainer',
    description: 'Low-impact elliptical cross trainer',
    category: 'Cardio',
    quantity: 4,
    purchase_date: '2021-11-15',
    maintenance_date: '2024-02-20',
    status: 'available'
  },
  {
    id: 7,
    name: 'Power Rack',
    description: 'Heavy duty power rack with pull-up bar',
    category: 'Strength',
    quantity: 3,
    purchase_date: '2022-08-30',
    maintenance_date: null,
    status: 'in_use'
  }
];

const Equipment: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would fetch from an API
    const fetchEquipment = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setEquipment(mockEquipment);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast.error('Failed to load equipment');
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategories = () => {
    const categories = new Set(equipment.map(item => item.category));
    return Array.from(categories);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'available':
        return { label: 'Available', variant: 'default', className: 'bg-green-100 text-green-800' };
      case 'in_use':
        return { label: 'In Use', variant: 'secondary', className: 'bg-blue-100 text-blue-800' };
      case 'maintenance':
        return { label: 'Maintenance', variant: 'outline', className: 'bg-orange-100 text-orange-800' };
      case 'retired':
        return { label: 'Retired', variant: 'destructive', className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, variant: 'outline', className: '' };
    }
  };

  const maintenanceNeeded = equipment.filter(
    item => item.status === 'maintenance' ||
    (item.maintenance_date && new Date(item.maintenance_date) <= new Date())
  ).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Equipment Management</h1>
            <p className="text-muted-foreground">Track and manage gym equipment</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate('/admin/equipment/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equipment.reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
              <p className="text-xs text-muted-foreground">
                Across {equipment.length} equipment types
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equipment
                  .filter(item => item.status === 'available')
                  .reduce((sum, item) => sum + item.quantity, 0)} items
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for member use
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="flex items-center">
                  Maintenance Required
                  {maintenanceNeeded > 0 && (
                    <AlertTriangle className="h-4 w-4 ml-2 text-orange-500" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {maintenanceNeeded} items
              </div>
              <p className="text-xs text-muted-foreground">
                Requiring service or maintenance
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>
              A complete list of gym equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : filteredEquipment.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={getStatusLabel(item.status).className}
                          >
                            {getStatusLabel(item.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.maintenance_date ? new Date(item.maintenance_date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/equipment/${item.id}`)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/admin/equipment/${item.id}/edit`)}
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
                <p className="text-muted-foreground">No equipment found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Equipment;
