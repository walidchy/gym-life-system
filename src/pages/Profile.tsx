
import React, { useState, useEffect } from 'react';
import { User, CreditCard, CheckCircle, Mail, Phone, Lock, Save } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '', // Changed from 'phone' to a temporary field
    address: '',
    bio: '',
    avatar: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Get phone from the appropriate profile based on user role
      let phone = '';
      if (user.role === 'member' && user.memberProfile) {
        phone = user.memberProfile.phone || '';
      } else if (user.role === 'trainer' && user.trainerProfile) {
        phone = user.trainerProfile.phone || '';
      } else if (user.role === 'admin' && user.adminProfile) {
        phone = user.adminProfile.phone || '';
      }
      
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: phone,
        address: '',
        bio: '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be an API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would be an API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profileData.avatar || `https://ui-avatars.com/api/?name=${profileData.name}`} />
                <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium">{profileData.name}</h3>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <div className="mt-2 text-sm text-muted-foreground">{user?.role}</div>
              <div className="mt-4 w-full">
                <div className="flex items-center py-2 border-t">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                <div className="flex items-center py-2 border-t">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{profileData.phoneNumber || 'No phone number provided'}</span>
                </div>
                <div className="flex items-center py-2 border-t border-b">
                  <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user?.is_verified ? 'Verified Account' : 'Unverified Account'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-8">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <form onSubmit={handleProfileSubmit}>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={profileData.name} 
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={profileData.email} 
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input 
                          id="phoneNumber" 
                          value={profileData.phoneNumber} 
                          onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea 
                          id="address" 
                          value={profileData.address} 
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={profileData.bio} 
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input 
                          id="avatar" 
                          value={profileData.avatar} 
                          onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                          placeholder="https://example.com/avatar.jpg"
                        />
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
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Update your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={passwordData.current_password} 
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={passwordData.new_password} 
                          onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={passwordData.confirm_password} 
                          onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⭘</span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
