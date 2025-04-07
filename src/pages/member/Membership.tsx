import React, { useState } from 'react';
import { Check } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '@/services/membership';
import { getMemberships } from '@/services/membership';

const MemberMembership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('plans');
  const queryClient = useQueryClient();

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => getMemberships('?active=1')
  });

  const bookingMutation = useMutation({
    mutationFn: (planId: number) => createBooking(planId),
    onSuccess: () => {
      toast.success('Booking created successfully');
    },
    onError: () => {
      toast.error('Failed to create booking');
    }
  });

  const handlePurchase = (planId: number) => {
    bookingMutation.mutate(planId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Available Plans</h1>
            <p className="text-muted-foreground">Select a plan to book your membership</p>
          </div>
        </div>

        <Tabs defaultValue="plans" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[200px] grid-cols-1">
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {memberships.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">${parseFloat(plan.price)}</span>
                        <span className="text-muted-foreground"> / {plan.duration_days} days</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {JSON.parse(plan.features).map((feature: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => handlePurchase(plan.id)}>
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MemberMembership;
