import Header from "@/components/Header";
import InvoiceForm from "@/components/InvoiceForm";
import RecentInvoices from "@/components/RecentInvoices";
import CreatorProfile from "@/components/CreatorProfile";
import SEOContent from "@/components/SEOContent";
import WordPressPromo from "@/components/WordPressPromo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Invoice Section */}
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

      {/* SEO Content Section */}
      <section className="bg-invoice-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SEOContent />
        </div>
      </section>

      {/* WordPress Course Promo */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WordPressPromo />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
