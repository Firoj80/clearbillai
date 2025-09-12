import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const LogoUpload = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-invoice-light hover:bg-secondary transition-colors">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-contain rounded" />
        ) : (
          <Plus className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-foreground mb-1">Upload logo</p>
        <p className="text-xs text-muted-foreground mb-2">
          Supported formats: JPG, PNG, SVG<br />
          Recommended size: 500px × 500px
        </p>
        
        <label htmlFor="logo-upload">
          <Button variant="secondary" className="cursor-pointer" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </span>
          </Button>
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <p className="text-xs text-muted-foreground mt-2">Max upload size: 1 MB</p>
      </div>
    </div>
  );
};

export default LogoUpload;