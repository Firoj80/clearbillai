import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Profile {
  id: string;
  name: string | null;
  business_name: string | null;
  phone: string | null;
  building_no: string | null;
  street_name: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  logo_url: string | null;
  signature_url: string | null;
}

interface PaymentDetails {
  profile_id: string;
  cash_accepted: boolean | null;
  paypal_email: string | null;
  upi_id: string | null;
  payment_link: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  account_number: string | null;
  account_type: string | null;
  ifsc_swift_code: string | null;
}

interface Client {
  id: string;
  client_name: string;
  business_name: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  created_at: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch payment details
      const { data: paymentData } = await supabase
        .from('payment_details')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (paymentData) {
        setPaymentDetails(paymentData);
      }

      // Fetch clients
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clientsData) {
        setClients(clientsData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !paymentDetails) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_details')
        .upsert({
          profile_id: user.id,
          ...paymentDetails
        });

      if (error) throw error;

      toast({
        title: "Payment details updated",
        description: "Your payment details have been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating payment details",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business Settings</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal and business information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile?.name || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        value={profile?.business_name || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, business_name: e.target.value} : null)}
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile?.phone || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="building_no">Building No</Label>
                        <Input
                          id="building_no"
                          value={profile?.building_no || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, building_no: e.target.value} : null)}
                          placeholder="Building number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street_name">Street Name</Label>
                        <Input
                          id="street_name"
                          value={profile?.street_name || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, street_name: e.target.value} : null)}
                          placeholder="Street name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="locality">Locality</Label>
                        <Input
                          id="locality"
                          value={profile?.locality || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, locality: e.target.value} : null)}
                          placeholder="Locality"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile?.city || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                          placeholder="City"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profile?.state || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">ZIP Code</Label>
                        <Input
                          id="zip_code"
                          value={profile?.zip_code || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, zip_code: e.target.value} : null)}
                          placeholder="ZIP code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={profile?.country || ''}
                          onChange={(e) => setProfile(prev => prev ? {...prev, country: e.target.value} : null)}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>
                  Configure your business branding and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={profile?.logo_url || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, logo_url: e.target.value} : null)}
                      placeholder="Enter logo URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Signature URL</Label>
                    <Input
                      value={profile?.signature_url || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, signature_url: e.target.value} : null)}
                      placeholder="Enter signature URL"
                    />
                  </div>
                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    {loading ? "Updating..." : "Update Business Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Configure your payment methods and bank details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentUpdate} className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cash_accepted"
                      checked={paymentDetails?.cash_accepted || false}
                      onCheckedChange={(checked) => 
                        setPaymentDetails(prev => prev ? {...prev, cash_accepted: checked as boolean} : {
                          profile_id: user.id,
                          cash_accepted: checked as boolean,
                          paypal_email: null,
                          upi_id: null,
                          payment_link: null,
                          bank_name: null,
                          account_holder_name: null,
                          account_number: null,
                          account_type: null,
                          ifsc_swift_code: null,
                        })
                      }
                    />
                    <Label htmlFor="cash_accepted">Accept Cash Payments</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paypal_email">PayPal Email</Label>
                      <Input
                        id="paypal_email"
                        type="email"
                        value={paymentDetails?.paypal_email || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, paypal_email: e.target.value} : {
                            profile_id: user.id,
                            cash_accepted: null,
                            paypal_email: e.target.value,
                            upi_id: null,
                            payment_link: null,
                            bank_name: null,
                            account_holder_name: null,
                            account_number: null,
                            account_type: null,
                            ifsc_swift_code: null,
                          }
                        )}
                        placeholder="Enter PayPal email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi_id">UPI ID</Label>
                      <Input
                        id="upi_id"
                        value={paymentDetails?.upi_id || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, upi_id: e.target.value} : {
                            profile_id: user.id,
                            cash_accepted: null,
                            paypal_email: null,
                            upi_id: e.target.value,
                            payment_link: null,
                            bank_name: null,
                            account_holder_name: null,
                            account_number: null,
                            account_type: null,
                            ifsc_swift_code: null,
                          }
                        )}
                        placeholder="Enter UPI ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_link">Payment Link</Label>
                      <Input
                        id="payment_link"
                        value={paymentDetails?.payment_link || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, payment_link: e.target.value} : {
                            profile_id: user.id,
                            cash_accepted: null,
                            paypal_email: null,
                            upi_id: null,
                            payment_link: e.target.value,
                            bank_name: null,
                            account_holder_name: null,
                            account_number: null,
                            account_type: null,
                            ifsc_swift_code: null,
                          }
                        )}
                        placeholder="Enter payment link"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank_name">Bank Name</Label>
                        <Input
                          id="bank_name"
                          value={paymentDetails?.bank_name || ''}
                          onChange={(e) => setPaymentDetails(prev => 
                            prev ? {...prev, bank_name: e.target.value} : {
                              profile_id: user.id,
                              cash_accepted: null,
                              paypal_email: null,
                              upi_id: null,
                              payment_link: null,
                              bank_name: e.target.value,
                              account_holder_name: null,
                              account_number: null,
                              account_type: null,
                              ifsc_swift_code: null,
                            }
                          )}
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_holder_name">Account Holder Name</Label>
                        <Input
                          id="account_holder_name"
                          value={paymentDetails?.account_holder_name || ''}
                          onChange={(e) => setPaymentDetails(prev => 
                            prev ? {...prev, account_holder_name: e.target.value} : {
                              profile_id: user.id,
                              cash_accepted: null,
                              paypal_email: null,
                              upi_id: null,
                              payment_link: null,
                              bank_name: null,
                              account_holder_name: e.target.value,
                              account_number: null,
                              account_type: null,
                              ifsc_swift_code: null,
                            }
                          )}
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_number">Account Number</Label>
                        <Input
                          id="account_number"
                          value={paymentDetails?.account_number || ''}
                          onChange={(e) => setPaymentDetails(prev => 
                            prev ? {...prev, account_number: e.target.value} : {
                              profile_id: user.id,
                              cash_accepted: null,
                              paypal_email: null,
                              upi_id: null,
                              payment_link: null,
                              bank_name: null,
                              account_holder_name: null,
                              account_number: e.target.value,
                              account_type: null,
                              ifsc_swift_code: null,
                            }
                          )}
                          placeholder="Enter account number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_type">Account Type</Label>
                        <Select
                          value={paymentDetails?.account_type || ''}
                          onValueChange={(value) => setPaymentDetails(prev => 
                            prev ? {...prev, account_type: value} : {
                              profile_id: user.id,
                              cash_accepted: null,
                              paypal_email: null,
                              upi_id: null,
                              payment_link: null,
                              bank_name: null,
                              account_holder_name: null,
                              account_number: null,
                              account_type: value,
                              ifsc_swift_code: null,
                            }
                          )}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifsc_swift_code">IFSC/SWIFT Code</Label>
                        <Input
                          id="ifsc_swift_code"
                          value={paymentDetails?.ifsc_swift_code || ''}
                          onChange={(e) => setPaymentDetails(prev => 
                            prev ? {...prev, ifsc_swift_code: e.target.value} : {
                              profile_id: user.id,
                              cash_accepted: null,
                              paypal_email: null,
                              upi_id: null,
                              payment_link: null,
                              bank_name: null,
                              account_holder_name: null,
                              account_number: null,
                              account_type: null,
                              ifsc_swift_code: e.target.value,
                            }
                          )}
                          placeholder="Enter IFSC/SWIFT code"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Payment Details"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  View and manage your clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.length === 0 ? (
                    <p className="text-muted-foreground">No clients found. Create invoices to automatically add clients.</p>
                  ) : (
                    <div className="grid gap-4">
                      {clients.map((client) => (
                        <div key={client.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{client.client_name}</h3>
                          {client.business_name && (
                            <p className="text-sm text-muted-foreground">{client.business_name}</p>
                          )}
                          {client.email && (
                            <p className="text-sm">{client.email}</p>
                          )}
                          {client.phone && (
                            <p className="text-sm">{client.phone}</p>
                          )}
                          {client.address && (
                            <p className="text-sm text-muted-foreground">{client.address}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;