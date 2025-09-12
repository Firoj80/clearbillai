import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const RecentInvoices = () => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-invoice-light rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No invoices yet</p>
          <p className="text-xs text-muted-foreground">Your recent invoices will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;