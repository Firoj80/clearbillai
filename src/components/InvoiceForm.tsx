import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import LogoUpload from "./LogoUpload";
import SignSealUpload from "./SignSealUpload";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  discount: number;
  amount: number;
}

const InvoiceForm = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", qty: 1, rate: 0, discount: 0, amount: 0 }
  ]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [businessFrom, setBusinessFrom] = useState("");
  const [billTo, setBillTo] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchClients();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setUserProfile(profileData);
        // Auto-populate business details
        const businessDetails = [
          profileData.business_name,
          profileData.name,
          [profileData.building_no, profileData.street_name].filter(Boolean).join(' '),
          profileData.locality,
          profileData.city,
          profileData.state,
          profileData.zip_code,
          profileData.country,
          profileData.phone
        ].filter(Boolean).join('\n');
        setBusinessFrom(businessDetails);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchClients = async () => {
    if (!user) return;

    try {
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clientsData) {
        setClients(clientsData);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      // Auto-populate client details
      const clientDetails = [
        client.client_name,
        client.business_name,
        client.address,
        client.email,
        client.phone
      ].filter(Boolean).join('\n');
      setBillTo(clientDetails);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      qty: 1,
      rate: 0,
      discount: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate amount when qty, rate, or discount changes
        if (field === 'qty' || field === 'rate' || field === 'discount') {
          const subtotal = updatedItem.qty * updatedItem.rate;
          const discountAmount = (subtotal * updatedItem.discount) / 100;
          updatedItem.amount = subtotal - discountAmount;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = (subtotal * globalDiscount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const total = subtotal - discountAmount + taxAmount + shipping;

  const generateAndDownloadInvoice = () => {
    // Create invoice content as HTML
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { margin-top: 20px; text-align: right; }
            .total-line { margin: 5px 0; }
            .final-total { font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <div>Invoice #: INV-${Date.now()}</div>
          </div>
          
          <div class="invoice-details">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <h3>From:</h3>
                <p>Your Business Details</p>
              </div>
              <div>
                <h3>To:</h3>
                <p>Client Details</p>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.description || 'Item'}</td>
                  <td>${item.qty}</td>
                  <td>$${item.rate.toFixed(2)}</td>
                  <td>${item.discount}%</td>
                  <td>$${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-line">Subtotal: $${subtotal.toFixed(2)}</div>
            <div class="total-line">Discount: -$${discountAmount.toFixed(2)}</div>
            <div class="total-line">Tax: $${taxAmount.toFixed(2)}</div>
            <div class="total-line">Shipping: $${shipping.toFixed(2)}</div>
            <div class="total-line final-total">Total: $${total.toFixed(2)}</div>
          </div>
        </body>
      </html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invoice Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <LogoUpload />
                <SignSealUpload />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input id="invoice-number" placeholder="INV-0001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="NET30" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due-on-receipt">Due on receipt</SelectItem>
                        <SelectItem value="net7">NET7</SelectItem>
                        <SelectItem value="net15">NET15</SelectItem>
                        <SelectItem value="net30">NET30</SelectItem>
                        <SelectItem value="net45">NET45</SelectItem>
                        <SelectItem value="net60">NET60</SelectItem>
                        <SelectItem value="net90">NET90</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issue-date">Issue Date</Label>
                    <Input id="issue-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="USD ($)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="inr">INR (Rs.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Invoice From</h3>
              <p className="text-sm text-muted-foreground mb-3">Your Business Details</p>
              <Textarea
                placeholder="Business Name,&#10;Address,&#10;Phone,&#10;Email,&#10;TAX ID, etc."
                className="min-h-[120px] resize-none"
                value={businessFrom}
                onChange={(e) => setBusinessFrom(e.target.value)}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Bill To</h3>
              <p className="text-sm text-muted-foreground mb-3">Select Client or Enter Details</p>
              {clients.length > 0 && (
                <div className="mb-3">
                  <Label>Select from existing clients</Label>
                  <Select onValueChange={handleClientSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.client_name} {client.business_name && `(${client.business_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Textarea
                placeholder="Client/Business Name,&#10;Address,&#10;Phone,&#10;Email,&#10;TAX ID, etc."
                className="min-h-[120px] resize-none"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-medium mb-4">Items</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-invoice-secondary px-4 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-invoice-text">
                  <div className="col-span-4">Item Description</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Discount</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1"></div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="px-4 py-3">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center space-x-1">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="col-span-1">
                        {items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={addItem}
              className="mt-4 w-full border-dashed border-primary text-primary hover:bg-primary/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Totals */}
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="w-full max-w-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Discount:</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={globalDiscount}
                        onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-sm"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Tax:</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-sm"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Shipping:</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={shipping}
                      onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button variant="outline" className="px-8">
              Cancel
            </Button>
            <Button onClick={generateAndDownloadInvoice} className="px-8">
              Create Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;