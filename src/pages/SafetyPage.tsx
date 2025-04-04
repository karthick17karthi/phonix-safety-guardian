
import React from 'react';
import { Bell, ShieldAlert, Shield, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SafetyPage: React.FC = () => {
  const handleStealthModeToggle = (enabled: boolean) => {
    if (enabled) {
      toast.success('Stealth mode activated');
    } else {
      toast.info('Stealth mode deactivated');
    }
  };

  const handleVoiceDetectionToggle = (enabled: boolean) => {
    if (enabled) {
      toast.success('Voice distress detection activated');
    } else {
      toast.info('Voice distress detection deactivated');
    }
  };

  const handleFakeShutdownActivate = () => {
    toast.success('Fake shutdown mode ready. Press power button 3 times quickly to activate.');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-phoenix-blue mb-2">Safety Tools</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configure your personal safety features and emergency settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-phoenix-teal" />
              Stealth Mode
            </CardTitle>
            <CardDescription>
              Activate discreet monitoring without alerting others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="stealth-mode">Enable Stealth Monitoring</Label>
                <p className="text-sm text-gray-500">
                  App will run in the background even when closed
                </p>
              </div>
              <Switch
                id="stealth-mode"
                onCheckedChange={handleStealthModeToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-phoenix-red" />
              Voice Distress Detection
            </CardTitle>
            <CardDescription>
              AI-powered detection of distress in your voice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="voice-detection">Enable Voice Detection</Label>
                <p className="text-sm text-gray-500">
                  Detects keywords and tone changes indicating distress
                </p>
              </div>
              <Switch
                id="voice-detection"
                onCheckedChange={handleVoiceDetectionToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-phoenix-blue" />
              Fake Shutdown
            </CardTitle>
            <CardDescription>
              Appears to shut down but continues monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              When activated, your phone will appear to shut down but will continue running 
              safety features and location tracking in stealth mode.
            </p>
            <Button 
              onClick={handleFakeShutdownActivate}
              className="w-full bg-phoenix-teal hover:bg-phoenix-teal/80"
            >
              Configure Fake Shutdown
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-phoenix-blue" />
              Safety Settings
            </CardTitle>
            <CardDescription>
              Configure your safety preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-record">Auto-Record in Emergency</Label>
                <Switch id="auto-record" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="shake-detect">Shake Detection</Label>
                <Switch id="shake-detect" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="location-tracking">Continuous Location Tracking</Label>
                <Switch id="location-tracking" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyPage;
