import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, AlertTriangle, RefreshCw, Save, X, Edit, Trash2, Eye } from 'lucide-react';
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
import { getEquipment, deleteEquipment, updateEquipment } from '@/services/equipment';
import { Equipment as EquipmentType } from '@/types';

const Equipment: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<EquipmentType>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const data = await getEquipment();
      setEquipment(data);
    } catch (error) {
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
        toast.error('Failed to delete equipment');
      }
    }
  };

  const handleEditClick = (item: EquipmentType) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
      maintenance_date: item.maintenance_date,
      description: item.description
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    setIsSaving(true);
    try {
      const updatedEquipment = await updateEquipment(editingId, editForm);
      setEquipment(prev => 
        prev.map(item => item.id === editingId ? updatedEquipment : item)
      );
      toast.success('Equipment updated successfully');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update equipment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    const matchesStatus = statusFilter === '' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const getCategories = () => {
    const categories = new Set(equipment.map(item => item.category));
    return Array.from(categories);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'Available', className: 'bg-green-100 text-green-800' };
      case 'in_use':
        return { label: 'In Use', className: 'bg-blue-100 text-blue-800' };
      case 'maintenance':
        return { label: 'Maintenance', className: 'bg-orange-100 text-orange-800' };
      case 'retired':
        return { label: 'Retired', className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, className: '' };
    }
  };

  const maintenanceNeeded = equipment.filter(
    item =>
      item.status === 'maintenance' ||
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
                {maintenanceNeeded > 0 && (
                  <AlertTriangle className="ml-2 h-4 w-4 text-orange-500" />
                )}
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
                    <option key={category} value={category}>
                      {category}
                    </option>
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
              <>
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
                      {currentItems.map((item) => {
                        const status = getStatusBadge(item.status);
                        return (
                          <React.Fragment key={item.id}>
                            {editingId === item.id ? (
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
                                  <select
                                    name="category"
                                    value={editForm.category || ''}
                                    onChange={handleEditFormChange}
                                    className="px-3 py-2 border rounded-md text-sm w-full"
                                  >
                                    {getCategories().map(category => (
                                      <option key={category} value={category}>
                                        {category}
                                      </option>
                                    ))}
                                  </select>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    name="quantity"
                                    type="number"
                                    value={editForm.quantity || 0}
                                    onChange={handleEditFormChange}
                                    min="0"
                                    className="w-full"
                                  />
                                </TableCell>
                                <TableCell>
                                  <select
                                    name="status"
                                    value={editForm.status || ''}
                                    onChange={handleEditFormChange}
                                    className="px-3 py-2 border rounded-md text-sm w-full"
                                  >
                                    <option value="available">Available</option>
                                    <option value="in_use">In Use</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="retired">Retired</option>
                                  </select>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    name="maintenance_date"
                                    type="date"
                                    value={editForm.maintenance_date ? 
                                      new Date(editForm.maintenance_date).toISOString().split('T')[0] : 
                                      ''}
                                    onChange={handleEditFormChange}
                                    className="w-full"
                                  />
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
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  <Badge className={status.className}>{status.label}</Badge>
                                </TableCell>
                                <TableCell>
                                  {item.maintenance_date
                                    ? new Date(item.maintenance_date).toLocaleDateString()
                                    : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/admin/equipment/${item.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-center items-center mt-4 gap-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  {equipment.length === 0
                    ? 'No equipment found in system'
                    : 'No matching equipment found'}
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={fetchEquipment}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh List
                  </Button>
                  <Button variant="default" onClick={() => navigate('/admin/equipment/new')}>
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