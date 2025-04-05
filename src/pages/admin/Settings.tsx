
import React, { useState } from 'react';
import { Save, Building, Clock, CreditCard, Bell, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import MainLayout from '@/components/layout/MainLayout';

const Settings: React.FC = () => {
  const [gymsettings, setGymSettings] = useState({
    name: 'GymLife Fitness Center',
    address: '123 Fitness Street, Exercise City, 12345',
    phone: '(555) 123-4567',
    email: 'info@gymlife.example',
    description: 'A modern fitness center with state-of-the-art equipment and classes for all fitness levels.',
    openingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' },
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newMember: true,
    newBooking: true,
    membershipExpiry: true,
    maintenanceAlerts: true,
    sendEmailNotifications: true,
    sendSmsNotifications: false,
    sendAppNotifications: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: 'USD',
    acceptCreditCards: true,
    acceptDebitCards: true,
    acceptPaypal: true,
    acceptCash: true,
    enableAutomaticRenewal: true,
    enableInstallmentPayments: false,
    invoicePrefix: 'GYM-INV-'
  });

  const [securitySettings, setSecuritySettings] = useState({
    enforceStrongPasswords: true,
    requireEmailVerification: true,
    allowStaffAccountCreation: false,
    autoLockoutAfterFailedAttempts: true,
    enableTwoFactorAuth: false,
    dataRetentionPeriodDays: 365
  });

  const handleSaveGeneralSettings = () => {
    toast.success('General settings saved successfully');
  };

  const handleSaveNotificationSettings = () => {
    toast.success('Notification settings saved successfully');
  };

  const handleSavePaymentSettings = () => {
    toast.success('Payment settings saved successfully');
  };

  const handleSaveSecuritySettings = () => {
    toast.success('Security settings saved successfully');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure your gym management system</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic information about your gym
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gym-name">Gym Name</Label>
                  <Input 
                    id="gym-name" 
                    value={gymsettings.name} 
                    onChange={(e) => setGymSettings({...gymsettings, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={gymsettings.address} 
                    onChange={(e) => setGymSettings({...gymsettings, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={gymsettings.phone} 
                      onChange={(e) => setGymSettings({...gymsettings, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={gymsettings.email} 
                      onChange={(e) => setGymSettings({...gymsettings, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={gymsettings.description} 
                    onChange={(e) => setGymSettings({...gymsettings, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Opening Hours</Label>
                  
                  {Object.entries(gymsettings.openingHours).map(([day, hours]) => (
                    <div key={day} className="grid grid-cols-3 gap-4 items-center">
                      <Label className="capitalize">{day}</Label>
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-open`} className="text-xs text-muted-foreground">Open</Label>
                        <Input 
                          id={`${day}-open`} 
                          type="time" 
                          value={hours.open} 
                          onChange={(e) => {
                            const updated = {...gymsettings};
                            updated.openingHours[day as keyof typeof gymsettings.openingHours].open = e.target.value;
                            setGymSettings(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-close`} className="text-xs text-muted-foreground">Close</Label>
                        <Input 
                          id={`${day}-close`} 
                          type="time" 
                          value={hours.close} 
                          onChange={(e) => {
                            const updated = {...gymsettings};
                            updated.openingHours[day as keyof typeof gymsettings.openingHours].close = e.target.value;
                            setGymSettings(updated);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveGeneralSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Triggers</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="new-member">New Member Registration</Label>
                      <Switch 
                        id="new-member" 
                        checked={notificationSettings.newMember} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newMember: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="new-booking">New Activity Booking</Label>
                      <Switch 
                        id="new-booking" 
                        checked={notificationSettings.newBooking} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newBooking: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="membership-expiry">Membership Expiry Alerts</Label>
                      <Switch 
                        id="membership-expiry" 
                        checked={notificationSettings.membershipExpiry} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, membershipExpiry: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="maintenance-alerts">Equipment Maintenance Alerts</Label>
                      <Switch 
                        id="maintenance-alerts" 
                        checked={notificationSettings.maintenanceAlerts} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, maintenanceAlerts: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Channels</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.sendEmailNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sendEmailNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                      </div>
                      <Switch 
                        id="sms-notifications" 
                        checked={notificationSettings.sendSmsNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sendSmsNotifications: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-notifications">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">Show notifications in the application</p>
                      </div>
                      <Switch 
                        id="app-notifications" 
                        checked={notificationSettings.sendAppNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, sendAppNotifications: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Textarea 
                    id="email-template" 
                    placeholder="Enter your email template with placeholders like {{name}}, {{date}}, etc." 
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use variables like {{name}}, {{date}}, {{gym_name}} in your template.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotificationSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure payment methods and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select 
                    id="currency" 
                    className="w-full p-2 border rounded-md"
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="credit-cards">Credit Cards</Label>
                      <Switch 
                        id="credit-cards" 
                        checked={paymentSettings.acceptCreditCards} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCreditCards: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="debit-cards">Debit Cards</Label>
                      <Switch 
                        id="debit-cards" 
                        checked={paymentSettings.acceptDebitCards} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptDebitCards: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="paypal">PayPal</Label>
                      <Switch 
                        id="paypal" 
                        checked={paymentSettings.acceptPaypal} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptPaypal: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="cash">Cash</Label>
                      <Switch 
                        id="cash" 
                        checked={paymentSettings.acceptCash} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, acceptCash: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Options</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="automatic-renewal">Automatic Membership Renewal</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically renew memberships when they expire
                        </p>
                      </div>
                      <Switch 
                        id="automatic-renewal" 
                        checked={paymentSettings.enableAutomaticRenewal} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableAutomaticRenewal: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="installment-payments">Installment Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow members to pay in installments
                        </p>
                      </div>
                      <Switch 
                        id="installment-payments" 
                        checked={paymentSettings.enableInstallmentPayments} 
                        onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableInstallmentPayments: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                  <Input 
                    id="invoice-prefix" 
                    value={paymentSettings.invoicePrefix} 
                    onChange={(e) => setPaymentSettings({...paymentSettings, invoicePrefix: e.target.value})}
                  />
                  <p className="text-sm text-muted-foreground">
                    This prefix will be added to all invoice numbers
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePaymentSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Payment Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="strong-passwords">Enforce Strong Passwords</Label>
                        <p className="text-sm text-muted-foreground">
                          Require passwords with at least 8 characters, including numbers and symbols
                        </p>
                      </div>
                      <Switch 
                        id="strong-passwords" 
                        checked={securitySettings.enforceStrongPasswords} 
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enforceStrongPasswords: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-verification">Require Email Verification</Label>
                        <p className="text-sm text-muted-foreground">
                          Verify email addresses before account activation
                        </p>
                      </div>
                      <Switch 
                        id="email-verification" 
                        checked={securitySettings.requireEmailVerification} 
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireEmailVerification: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="staff-accounts">Allow Staff Account Creation</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow new staff accounts to be created
                        </p>
                      </div>
                      <Switch 
                        id="staff-accounts" 
                        checked={securitySettings.allowStaffAccountCreation} 
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, allowStaffAccountCreation: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="account-lockout">Auto Lockout After Failed Attempts</Label>
                        <p className="text-sm text-muted-foreground">
                          Lock accounts after multiple failed login attempts
                        </p>
                      </div>
                      <Switch 
                        id="account-lockout" 
                        checked={securitySettings.autoLockoutAfterFailedAttempts} 
                        onCheckedChange={(checked) => setSecuritySettings({...securitySettings, autoLockoutAfterFailedAttempts: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication</h3>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for admin accounts
                      </p>
                    </div>
                    <Switch 
                      id="two-factor" 
                      checked={securitySettings.enableTwoFactorAuth} 
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactorAuth: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Input 
                    id="data-retention" 
                    type="number" 
                    value={securitySettings.dataRetentionPeriodDays} 
                    onChange={(e) => setSecuritySettings({...securitySettings, dataRetentionPeriodDays: parseInt(e.target.value)})}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days to retain user data after account deletion
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSecuritySettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
