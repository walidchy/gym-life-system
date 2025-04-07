import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, AlertTriangle, RefreshCw } from 'lucide-react';
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
import { getEquipment, deleteEquipment } from '@/services/equipment';

const Equipment: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const data = await getEquipment();
      console.log("Fetched equipment:", data);
      setEquipment(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load equipment');
      setEquipment([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await deleteEquipment(id);
        setEquipment(prev => prev.filter(item => item.id !== id));
        toast.success('Equipment deleted successfully');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete equipment');
      }
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategories = () => {
    const categories = new Set(equipment.map(item => item.category));
    return Array.from(categories);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available': return { label: 'Available', className: 'bg-green-100 text-green-800' };
      case 'in_use': return { label: 'In Use', className: 'bg-blue-100 text-blue-800' };
      case 'maintenance': return { label: 'Maintenance', className: 'bg-orange-100 text-orange-800' };
      case 'retired': return { label: 'Retired', className: 'bg-red-100 text-red-800' };
      default: return { label: status, className: '' };
    }
  };

  const maintenanceNeeded = equipment.filter(
    item => item.status === 'maintenance' || 
           (item.maintenance_date && new Date(item.maintenance_date) <= new Date())
  ).length;

  const totalItems = equipment.reduce((sum, item) => sum + item.quantity, 0);
  const availableItems = equipment
    .filter(item => item.status === 'available')
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Equipment Management</h1>
            <p className="text-muted-foreground">Manage gym equipment inventory</p>
          </div>
          <Button onClick={() => navigate('/admin/equipment/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {equipment.length} equipment types
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableItems}</div>
              <p className="text-xs text-muted-foreground">Ready for use</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                Maintenance Needed
                {maintenanceNeeded > 0 && <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceNeeded}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>All gym equipment items</CardDescription>
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
                  className="px-3 py-2 border rounded-md text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="px-3 py-2 border rounded-md text-sm"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary" />
              </div>
            ) : filteredEquipment.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Maintenance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => {
                      const status = getStatusBadge(item.status);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Badge className={status.className}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            {item.maintenance_date ? 
                              new Date(item.maintenance_date).toLocaleDateString() : 'N/A'}
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(item.id)}
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
                <p className="text-muted-foreground mb-4">
                  {equipment.length === 0 ? 'No equipment found in system' : 'No matching equipment found'}
                </p>
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline"
                    onClick={fetchEquipment}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh List
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => navigate('/admin/equipment/new')}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Equipment
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

export default Equipment;