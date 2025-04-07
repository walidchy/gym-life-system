
import React, { useState } from 'react';
import { CreditCard, Check, AlertCircle, Calendar } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentMembership, cancelMembership } from '@/services/membership';

const mockPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 29.99,
    duration_days: 30,
    description: 'Access to gym facilities during standard hours',
    features: [
      'Access to gym equipment',
      'Locker room access',
      'Standard opening hours',
    ],
    is_recommended: false
  },
  {
    id: 2,
    name: 'Premium',
    price: 49.99,
    duration_days: 30,
    description: 'Full access to gym and 2 fitness classes per week',
    features: [
      'Access to gym equipment',
      'Locker room access',
      'Extended opening hours',
      '2 fitness classes per week',
      'Nutrition consultation',
    ],
    is_recommended: true
  },
  {
    id: 3,
    name: 'Elite',
    price: 89.99,
    duration_days: 30,
    description: 'Full access to all facilities and unlimited classes',
    features: [
      'Access to gym equipment',
      'Locker room access',
      '24/7 gym access',
      'Unlimited fitness classes',
      'Personal trainer session (1/month)',
      'Nutrition consultation',
      'Spa access',
    ],
    is_recommended: false
  },
];

const MemberMembership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const queryClient = useQueryClient();

  // Fetch membership with React Query
  const { data: membership, isLoading } = useQuery({
    queryKey: ['membership', 'current'],
    queryFn: getCurrentMembership
  });

  // Cancel membership mutation
  const cancelMembershipMutation = useMutation({
    mutationFn: () => cancelMembership(membership?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership', 'current'] });
      toast.success('Membership cancellation request submitted');
    },
    onError: (error) => {
      console.error('Error cancelling membership:', error);
      toast.error('Failed to cancel membership');
    }
  });

  // Calculate days remaining in membership
  const getDaysRemaining = () => {
    if (!membership) return 0;
    
    const endDate = new Date(membership.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();
  const totalDays = membership?.membership_plan?.duration_days || 30;
  const percentRemaining = Math.round((daysRemaining / totalDays) * 100);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePurchase = (planId: number) => {
    // Would send API request to purchase plan
    toast.success('Membership purchased successfully');
    // In a real app, would refresh membership data
    queryClient.invalidateQueries({ queryKey: ['membership', 'current'] });
  };

  const handleCancelMembership = () => {
    cancelMembershipMutation.mutate();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Membership</h1>
            <p className="text-muted-foreground">Manage your gym membership</p>
          </div>
        </div>

        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="current">Current Membership</TabsTrigger>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : membership ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{membership.membership_plan?.name} Membership</CardTitle>
                      <CardDescription>Active membership details</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Membership Period</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p>
                            {formatDate(membership.start_date)} - {formatDate(membership.end_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Time Remaining</h3>
                        <div className="space-y-2 mt-1">
                          <div className="flex justify-between text-sm">
                            <span>{daysRemaining} days left</span>
                            <span>{percentRemaining}%</span>
                          </div>
                          <Progress value={percentRemaining} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <p>Next payment: {formatDate(membership.end_date)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Included Benefits</h3>
                        <ul className="mt-2 space-y-1">
                          {membership.membership_plan?.features?.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelMembership}
                    disabled={cancelMembershipMutation.isPending}
                  >
                    {cancelMembershipMutation.isPending ? 'Processing...' : 'Cancel Membership'}
                  </Button>
                  <Button asChild>
                    <a href="#plans" onClick={() => setActiveTab('plans')}>
                      Upgrade Plan
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Membership</CardTitle>
                  <CardDescription>You don't have an active membership</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Membership Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      You currently don't have an active membership. Purchase a membership to access our gym facilities and classes.
                    </p>
                    <Button onClick={() => setActiveTab('plans')}>
                      View Membership Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="plans" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {mockPlans.map((plan) => (
                <Card key={plan.id} className={plan.is_recommended ? 'border-primary' : ''}>
                  {plan.is_recommended && (
                    <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.is_recommended ? 'default' : 'outline'}
                      onClick={() => handlePurchase(plan.id)}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MemberMembership;
