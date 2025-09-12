import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, TrendingUp } from "lucide-react";

const CreatorProfile = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <Youtube className="w-5 h-5 mr-2 text-destructive" />
            Meet the Creator
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto flex items-center justify-center">
            <span className="text-xl font-bold text-white">SK</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Saddam Kassim</h3>
            <p className="text-sm text-muted-foreground">YouTuber & Digital Marketer</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            I created DueClear after noticing many small businesses struggle with invoicing. 
            As a digital marketer, I saw firsthand how proper invoicing impacts professionalism 
            and cash flow. This free tool simplifies the process, helping freelancers and 
            entrepreneurs create polished invoices without the learning curve. My goal is to 
            empower businesses to look professional while focusing on what they do best.
          </p>
          <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <Youtube className="w-4 h-4 mr-2" />
            Visit my YouTube Channel
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            You might be interested in...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">W</span>
              </div>
              <div>
                <p className="text-sm font-medium">40k+ Enrollments</p>
                <p className="text-lg font-bold">WordPress</p>
                <p className="text-xs opacity-90">Complete Course</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProfile;