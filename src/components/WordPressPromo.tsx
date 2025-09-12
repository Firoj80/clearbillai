import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";

const WordPressPromo = () => {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">WordPress for Beginners</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <span className="text-sm text-muted-foreground">720+ Google Reviews</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">₹199/-</span>
                <span className="text-sm text-muted-foreground line-through">₹999/-</span>
              </div>
              <p className="text-sm text-success font-medium">40,000+ students enrolled worldwide</p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              If you want to learn the basics of WordPress development and build your own website, 
              this is the right course.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Trustpilot Ratings</span>
                <span className="font-medium">797 reviews</span>
              </div>
              <div className="space-y-1">
                {[
                  { stars: 5, count: 650 },
                  { stars: 4, count: 100 },
                  { stars: 3, count: 30 },
                  { stars: 2, count: 12 },
                  { stars: 1, count: 5 }
                ].map(({ stars, count }) => (
                  <div key={stars} className="flex items-center space-x-2">
                    <span className="text-xs w-8">{stars}-star</span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-warning h-2 rounded-full" 
                        style={{ width: `${(count / 797) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" asChild>
              <a href="https://wpclasslive.com/" target="_blank" rel="noopener noreferrer">
                Check Details
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">W</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">WordPress 2025 Course</h3>
                  <p className="text-sm opacity-90">Complete Beginner's Guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordPressPromo;