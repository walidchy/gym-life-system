
import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { updateProfile } from '@/services/profile';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { User as UserType } from '@/types';
import { Textarea } from '@/components/ui/textarea';

const TrainerProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async () => {
    const response = await api.get<{ data: UserType }>('/profile');
    return response.data.data;
  };

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!user
  });

  const [formData, setFormData] = useState({
    phone: '',
    specialization: '',
    experience_years: '',
    certifications: '',
  });

  useEffect(() => {
    if (profileData && profileData.trainerProfile) {
      setFormData({
        phone: profileData.phone || '',
        specialization: profileData.trainerProfile.specialization || '',
        experience_years: profileData.trainerProfile.experience_years?.toString() || '',
        certifications: profileData.trainerProfile.certifications?.join(', ') || '',
      });
    }
  }, [profileData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert experience_years to number and certifications to array
      const dataToSubmit = {
        phone: formData.phone,
        trainerProfile: {
          specialization: formData.specialization,
          experience_years: formData.experience_years ? Number(formData.experience_years) : undefined,
          certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()) : []
        }
      };

      const updatedUser = await updateProfile(dataToSubmit);
      setUser({ ...user, ...updatedUser });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Trainer Profile</h1>
          <p className="text-muted-foreground">Manage your trainer profile settings and preferences</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Trainer Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Trainer Information</CardTitle>
                  <CardDescription>Update your trainer profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={profileData?.name || ''} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileData?.email || ''} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={profileData?.role || ''} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({ ...formData, specialization: e.target.value })
                      }
                      placeholder="e.g. Strength Training, Yoga, Cardio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({ ...formData, experience_years: e.target.value })
                      }
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) =>
                        setFormData({ ...formData, certifications: e.target.value })
                      }
                      placeholder="Enter certifications separated by commas"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter certifications separated by commas (e.g. ACE, NASM, ISSA)
                    </p>
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TrainerProfile;
