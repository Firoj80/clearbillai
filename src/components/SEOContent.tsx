import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, CreditCard, Globe, Calculator, Users, Zap } from "lucide-react";

const SEOContent = () => {
  const features = [
    {
      icon: Download,
      title: "Instant PDF Download",
      description: "Generate and download professional PDF invoices with a single click"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Support for bank transfers, PayPal, UPI, and custom payment links"
    },
    {
      icon: Globe,
      title: "Currency Support",
      description: "Create invoices in any currency with automatic formatting"
    },
    {
      icon: Calculator,
      title: "Taxes & Discounts",
      description: "Easy calculation of taxes, discounts, and shipping costs"
    },
    {
      icon: Users,
      title: "No Sign-up Required",
      description: "Start creating invoices immediately without registration"
    },
    {
      icon: Zap,
      title: "100% Free Forever",
      description: "No hidden costs or premium features; everything is accessible to everyone"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Main SEO Content */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          DueClear: Free Professional Invoice Generator
        </h1>
        
        <div className="space-y-4 text-lg text-muted-foreground max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Why Choose Our Free Invoice Generator?
          </h2>
          
          <p className="leading-relaxed">
            DueClear provides a completely <strong className="text-primary">free invoice generator</strong> that helps freelancers, 
            small businesses, and entrepreneurs create professional-looking invoices in minutes. No hidden fees, 
            no subscriptions, and no limitations on the number of invoices you can create.
          </p>
          
          <p className="leading-relaxed">
            Our <strong className="text-primary">online invoice maker</strong> offers customizable templates that can be tailored 
            to match your brand identity. Add your logo, choose your currency, and personalize your payment terms 
            to create professional invoices that get you paid faster.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          Features That Make Invoicing Simple
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="bg-invoice-light rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-foreground mb-6">
          Perfect For All Professionals
        </h2>
        
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you're a freelancer, consultant, small business owner, or service provider, 
            our <strong className="text-primary">free online invoicing software</strong> is designed to meet your needs. 
            Create unlimited professional invoices, track payments, and maintain a professional image with your clients.
          </p>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Start using DueClear today and experience how easy it is to create professional invoices in seconds. 
            No credit card required, no trial periods - just a powerful, completely free invoice generator at your fingertips.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SEOContent;