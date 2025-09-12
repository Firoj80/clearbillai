import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import RecentInvoices from "@/components/RecentInvoices";
import CreatorProfile from "@/components/CreatorProfile";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <InvoiceForm />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <RecentInvoices />
            <CreatorProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
