import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import LogoUpload from "@/components/LogoUpload";
import SignSealUpload from "@/components/SignSealUpload";

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

export function BusinessSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create empty profile structure
        setProfile({
          id: user.id,
          name: null,
          business_name: null,
          phone: null,
          building_no: null,
          street_name: null,
          locality: null,
          city: null,
          state: null,
          zip_code: null,
          country: null,
          logo_url: null,
          signature_url: null,
        });
      }

      // Fetch payment details
      const { data: paymentData } = await supabase
        .from('payment_details')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (paymentData) {
        setPaymentDetails(paymentData);
      } else {
        // Create empty payment details structure
        setPaymentDetails({
          profile_id: user.id,
          cash_accepted: null,
          paypal_email: null,
          upi_id: null,
          payment_link: null,
          bank_name: null,
          account_holder_name: null,
          account_number: null,
          account_type: null,
          ifsc_swift_code: null,
        });
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

  if (!profile || !paymentDetails) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-48"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-10 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-muted-foreground">
          Manage your business profile, payment methods, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>
                Update your business information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <Input
                      id="business_name"
                      value={profile.business_name || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, business_name: e.target.value} : null)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
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
                        value={profile.building_no || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, building_no: e.target.value} : null)}
                        placeholder="Building number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="street_name">Street Name</Label>
                      <Input
                        id="street_name"
                        value={profile.street_name || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, street_name: e.target.value} : null)}
                        placeholder="Street name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locality">Locality</Label>
                      <Input
                        id="locality"
                        value={profile.locality || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, locality: e.target.value} : null)}
                        placeholder="Locality"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profile.city || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, city: e.target.value} : null)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profile.state || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, state: e.target.value} : null)}
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        value={profile.zip_code || ''}
                        onChange={(e) => setProfile(prev => prev ? {...prev, zip_code: e.target.value} : null)}
                        placeholder="ZIP code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profile.country || ''}
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

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Assets</CardTitle>
              <CardDescription>
                Upload your business logo and signature for invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Business Logo</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your business logo to appear on invoices
                  </p>
                  <LogoUpload />
                </div>
                <div>
                  <Label className="text-base font-medium">Signature</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload your signature or business seal
                  </p>
                  <SignSealUpload />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo URL (Alternative)</Label>
                  <Input
                    value={profile.logo_url || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, logo_url: e.target.value} : null)}
                    placeholder="Enter logo URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signature URL (Alternative)</Label>
                  <Input
                    value={profile.signature_url || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, signature_url: e.target.value} : null)}
                    placeholder="Enter signature URL"
                  />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Branding"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure your payment methods and bank details for invoices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentUpdate} className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cash_accepted"
                    checked={paymentDetails.cash_accepted || false}
                    onCheckedChange={(checked) => 
                      setPaymentDetails(prev => prev ? {...prev, cash_accepted: checked as boolean} : null)
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
                      value={paymentDetails.paypal_email || ''}
                      onChange={(e) => setPaymentDetails(prev => 
                        prev ? {...prev, paypal_email: e.target.value} : null
                      )}
                      placeholder="Enter PayPal email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi_id">UPI ID</Label>
                    <Input
                      id="upi_id"
                      value={paymentDetails.upi_id || ''}
                      onChange={(e) => setPaymentDetails(prev => 
                        prev ? {...prev, upi_id: e.target.value} : null
                      )}
                      placeholder="Enter UPI ID"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="payment_link">Payment Link</Label>
                    <Input
                      id="payment_link"
                      value={paymentDetails.payment_link || ''}
                      onChange={(e) => setPaymentDetails(prev => 
                        prev ? {...prev, payment_link: e.target.value} : null
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
                        value={paymentDetails.bank_name || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, bank_name: e.target.value} : null
                        )}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account_holder_name">Account Holder Name</Label>
                      <Input
                        id="account_holder_name"
                        value={paymentDetails.account_holder_name || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, account_holder_name: e.target.value} : null
                        )}
                        placeholder="Enter account holder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account_number">Account Number</Label>
                      <Input
                        id="account_number"
                        value={paymentDetails.account_number || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, account_number: e.target.value} : null
                        )}
                        placeholder="Enter account number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account_type">Account Type</Label>
                      <Select
                        value={paymentDetails.account_type || ''}
                        onValueChange={(value) => setPaymentDetails(prev => 
                          prev ? {...prev, account_type: value} : null
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
                        value={paymentDetails.ifsc_swift_code || ''}
                        onChange={(e) => setPaymentDetails(prev => 
                          prev ? {...prev, ifsc_swift_code: e.target.value} : null
                        )}
                        placeholder="Enter IFSC or SWIFT code"
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
      </Tabs>
    </div>
  );
}