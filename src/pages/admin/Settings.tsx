
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Clock, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gymSettings, setGymSettings] = useState({
    gym_name: 'GYMLIFE Fitness Center',
    email: 'info@gymlife.com',
    phone: '(555) 123-4567',
    address: '123 Fitness Ave, Health City, CA 90210',
    opening_hours: '6:00 AM - 10:00 PM',
    weekend_hours: '8:00 AM - 8:00 PM',
    description: 'A premium fitness center focused on helping members achieve their fitness goals through modern equipment, expert training, and a supportive community.',
    enable_online_bookings: true,
    enable_notifications: true,
    maintenance_mode: false,
    allow_guest_passes: true,
    max_class_size: 20,
    cancellation_policy_hours: 24,
  });
  
  const [staffRoles, setStaffRoles] = useState([
    { id: 1, role: 'Manager', permissions: ['view', 'edit', 'delete'] },
    { id: 2, role: 'Front Desk', permissions: ['view', 'edit'] },
    { id: 3, role: 'Trainer', permissions: ['view'] },
  ]);
  
  const [newRole, setNewRole] = useState({ 
    role: '', 
    permissions: ['view'] 
  });
  
  const [backupSettings, setBackupSettings] = useState({
    automatic_backup: true,
    backup_frequency: 'daily',
    last_backup: '2023-06-10 09:30 AM',
  });
  
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, action: 'System settings updated', user: 'Admin', timestamp: '2023-06-10 10:23 AM' },
    { id: 2, action: 'New membership plan added', user: 'Admin', timestamp: '2023-06-09 3:45 PM' },
    { id: 3, action: 'Database backup performed', user: 'System', timestamp: '2023-06-09 12:00 AM' },
    { id: 4, action: 'Equipment maintenance scheduled', user: 'Manager', timestamp: '2023-06-08 1:12 PM' },
  ]);
  
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be an API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Gym settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddRole = () => {
    if (!newRole.role.trim()) {
      toast.error('Role name cannot be empty');
      return;
    }
    
    setStaffRoles([
      ...staffRoles, 
      { 
        id: staffRoles.length + 1, 
        ...newRole
      }
    ]);
    setNewRole({ role: '', permissions: ['view'] });
    toast.success('New role added successfully');
  };
  
  const handleDeleteRole = (id: number) => {
    setStaffRoles(staffRoles.filter(role => role.id !== id));
    toast.success('Role deleted successfully');
  };
  
  const togglePermission = (roleId: number, permission: string) => {
    setStaffRoles(staffRoles.map(role => {
      if (role.id === roleId) {
        if (role.permissions.includes(permission)) {
          return {
            ...role,
            permissions: role.permissions.filter(p => p !== permission)
          };
        } else {
          return {
            ...role,
            permissions: [...role.permissions, permission]
          };
        }
      }
      return role;
    }));
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gym Settings</h1>
          <p className="text-muted-foreground">Manage gym settings and configuration</p>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="roles">Staff Roles</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <form onSubmit={handleSettingsSubmit}>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure the basic information and settings for your gym
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gym_name">Gym Name</Label>
                      <Input 
                        id="gym_name" 
                        value={gymSettings.gym_name} 
                        onChange={(e) => setGymSettings({...gymSettings, gym_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Mail className="h-4 w-4" />
                        </span>
                        <Input 
                          id="email" 
                          type="email" 
                          className="rounded-l-none"
                          value={gymSettings.email} 
                          onChange={(e) => setGymSettings({...gymSettings, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Phone className="h-4 w-4" />
                        </span>
                        <Input 
                          id="phone" 
                          className="rounded-l-none"
                          value={gymSettings.phone} 
                          onChange={(e) => setGymSettings({...gymSettings, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <Input 
                          id="address" 
                          className="rounded-l-none"
                          value={gymSettings.address} 
                          onChange={(e) => setGymSettings({...gymSettings, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opening_hours">Weekday Hours</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Clock className="h-4 w-4" />
                        </span>
                        <Input 
                          id="opening_hours" 
                          className="rounded-l-none"
                          value={gymSettings.opening_hours} 
                          onChange={(e) => setGymSettings({...gymSettings, opening_hours: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weekend_hours">Weekend Hours</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          <Calendar className="h-4 w-4" />
                        </span>
                        <Input 
                          id="weekend_hours" 
                          className="rounded-l-none"
                          value={gymSettings.weekend_hours} 
                          onChange={(e) => setGymSettings({...gymSettings, weekend_hours: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={3}
                      value={gymSettings.description} 
                      onChange={(e) => setGymSettings({...gymSettings, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">System Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable_online_bookings" className="font-medium">Enable Online Bookings</Label>
                          <p className="text-sm text-muted-foreground">Allow members to book classes and sessions online</p>
                        </div>
                        <Switch 
                          id="enable_online_bookings" 
                          checked={gymSettings.enable_online_bookings}
                          onCheckedChange={(checked) => setGymSettings({...gymSettings, enable_online_bookings: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="enable_notifications" className="font-medium">Enable Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications for bookings, reminders, and updates</p>
                        </div>
                        <Switch 
                          id="enable_notifications" 
                          checked={gymSettings.enable_notifications}
                          onCheckedChange={(checked) => setGymSettings({...gymSettings, enable_notifications: checked})}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance_mode" className="font-medium">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Temporarily disable online access for maintenance</p>
                        </div>
                        <Switch 
                          id="maintenance_mode" 
                          checked={gymSettings.maintenance_mode}
                          onCheckedChange={(checked) => setGymSettings({...gymSettings, maintenance_mode: checked})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="max_class_size">Max Class Size</Label>
                      <Input 
                        id="max_class_size" 
                        type="number" 
                        min="1"
                        value={gymSettings.max_class_size} 
                        onChange={(e) => setGymSettings({...gymSettings, max_class_size: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cancellation_policy_hours">Cancellation Policy (hours)</Label>
                      <Input 
                        id="cancellation_policy_hours" 
                        type="number" 
                        min="0"
                        value={gymSettings.cancellation_policy_hours} 
                        onChange={(e) => setGymSettings({...gymSettings, cancellation_policy_hours: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="allow_guest_passes" className="font-medium">Allow Guest Passes</Label>
                        <p className="text-sm text-muted-foreground">Enable guest pass feature</p>
                      </div>
                      <Switch 
                        id="allow_guest_passes" 
                        checked={gymSettings.allow_guest_passes}
                        onCheckedChange={(checked) => setGymSettings({...gymSettings, allow_guest_passes: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⭘</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Staff Roles and Permissions</CardTitle>
                <CardDescription>
                  Manage staff roles and their access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-center">View</TableHead>
                        <TableHead className="text-center">Edit</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>{role.role}</TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={role.permissions.includes('view')}
                              onCheckedChange={() => togglePermission(role.id, 'view')}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={role.permissions.includes('edit')}
                              onCheckedChange={() => togglePermission(role.id, 'edit')}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={role.permissions.includes('delete')}
                              onCheckedChange={() => togglePermission(role.id, 'delete')}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Add New Role</h3>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="role_name">Role Name</Label>
                        <Input 
                          id="role_name" 
                          value={newRole.role} 
                          onChange={(e) => setNewRole({...newRole, role: e.target.value})}
                          placeholder="Enter role name"
                        />
                      </div>
                      
                      <div className="mt-6">
                        <Button onClick={handleAddRole}>
                          Add Role
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Database Backups</CardTitle>
                <CardDescription>
                  Configure automatic backups and restore from previous backups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="automatic_backup" className="font-medium">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Schedule automatic backups of your data</p>
                    </div>
                    <Switch 
                      id="automatic_backup" 
                      checked={backupSettings.automatic_backup}
                      onCheckedChange={(checked) => setBackupSettings({...backupSettings, automatic_backup: checked})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <select
                      id="backup_frequency"
                      className="w-full p-2 border rounded-md"
                      value={backupSettings.backup_frequency}
                      onChange={(e) => setBackupSettings({...backupSettings, backup_frequency: e.target.value})}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Backup History</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-muted-foreground">Last backup: {backupSettings.last_backup}</p>
                    </div>
                    
                    <div className="mt-4 flex gap-4">
                      <Button>
                        Backup Now
                      </Button>
                      <Button variant="outline">
                        Restore from Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
                <CardDescription>
                  Review recent system activities and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
