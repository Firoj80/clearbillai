import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Due<span className="text-primary">Clear</span>
              </span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Home
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Invoicing Guide
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Help
            </Button>
            
            <div className="flex items-center space-x-4 ml-4">
              {user ? (
                <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
                  <Button onClick={() => navigate("/auth")}>Get Started</Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;