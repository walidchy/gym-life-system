
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  Mail,
  Phone,
  Search,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import { getTrainerClients } from '@/services/trainer';

const TrainerClients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  
  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['trainerClients'],
    queryFn: () => getTrainerClients(),
  });

  // Mock data for demonstration
  const mockClients = [
    {
      id: 1,
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      phone: '+1 (555) 123-4567',
      avatar: null,
      progress: 80,
      lastSession: '2 days ago',
      nextSession: 'Tomorrow, 10:00 AM',
      goals: ['Weight loss', 'Improved strength'],
      membership: {
        name: 'Premium',
        end_date: '2025-08-15',
      },
      notes: 'Jane has been making excellent progress on her strength training routine. Consider increasing weights next session.',
      sessions_completed: 28,
      sessions_missed: 2,
    },
    {
      id: 2,
      name: 'Wade Warren',
      email: 'wade.warren@example.com',
      phone: '+1 (555) 987-6543',
      avatar: null,
      progress: 65,
      lastSession: '1 week ago',
      nextSession: 'Wed, Apr 9, 3:30 PM',
      goals: ['Muscle gain', 'Endurance'],
      membership: {
        name: 'Standard',
        end_date: '2025-05-22',
      },
      notes: 'Wade needs to focus on proper form during squat exercises. Showed improvement in cardio endurance.',
      sessions_completed: 15,
      sessions_missed: 4,
    },
    {
      id: 3,
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      phone: '+1 (555) 765-4321',
      avatar: null,
      progress: 90,
      lastSession: 'Yesterday',
      nextSession: 'Fri, Apr 11, 2:00 PM',
      goals: ['Flexibility', 'Core strength'],
      membership: {
        name: 'Premium Plus',
        end_date: '2025-10-05',
      },
      notes: 'Excellent flexibility improvements. Continue with current yoga and pilates program.',
      sessions_completed: 32,
      sessions_missed: 1,
    },
  ];
  
  // We would normally use the fetched data, but for demo purposes, we'll use the mock data
  const clients = clientsData?.data || mockClients;
  
  const filteredClients = clients.filter((client) => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleClientExpanded = (clientId: number) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Clients</h1>
            <p className="text-muted-foreground">
              View and manage the clients you're training
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-[240px]"
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
            <Button>Add New Client</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-primary"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <User className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">No clients found</h3>
              <p className="text-sm text-gray-500 max-w-md">
                You don't have any clients yet or none match your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Collapsible
                key={client.id}
                open={expandedClient === client.id}
                onOpenChange={() => toggleClientExpanded(client.id)}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar || ''} alt={client.name} />
                      <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{client.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-y-1 sm:gap-x-4">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0 space-x-2">
                    <div className="mr-4">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="relative w-32 h-2 bg-gray-200 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-2 bg-gym-secondary rounded-full"
                          style={{ width: `${client.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {expandedClient === client.id ? (
                          <ChevronUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        )}
                        {expandedClient === client.id ? 'Less' : 'More'}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="border-t p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          Session Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Session:</span>
                            <span>{client.lastSession}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next Session:</span>
                            <span>{client.nextSession}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Completed:</span>
                            <span>{client.sessions_completed} sessions</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Missed:</span>
                            <span>{client.sessions_missed} sessions</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-gray-500" />
                          Goals & Membership
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Goals:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {client.goals.map((goal, index) => (
                                <span 
                                  key={index} 
                                  className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs"
                                >
                                  {goal}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-500">Membership:</span>
                            <span>{client.membership.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires:</span>
                            <span>{new Date(client.membership.end_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-gray-500" />
                          Trainer Notes
                        </h4>
                        <p className="text-sm">{client.notes}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">Edit Profile</Button>
                      <Button size="sm">Schedule Session</Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Client Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Total Clients</h3>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-gray-500">Active clients</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Sessions This Week</h3>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">Scheduled sessions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Avg. Client Progress</h3>
                <p className="text-2xl font-bold">
                  {Math.round(clients.reduce((sum, client) => sum + client.progress, 0) / clients.length)}%
                </p>
                <p className="text-sm text-gray-500">Across all clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default TrainerClients;
