
import React, { useState } from 'react';
import { MapPin, Navigation, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const RoutesPage: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isRouteFound, setIsRouteFound] = useState(false);

  const handleFindRoute = () => {
    if (!origin || !destination) {
      toast.error('Please enter both origin and destination');
      return;
    }

    // In a real app, this would call a maps API
    setIsRouteFound(true);
    toast.success('Safe route found');
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-phoenix-blue mb-2">Safe Routes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find and navigate safer routes with real-time safety data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="mr-2 h-5 w-5 text-phoenix-teal" />
            Plan Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Start Location</Label>
                <div className="flex">
                  <div className="bg-muted p-2 rounded-l-md border border-r-0">
                    <MapPin className="h-5 w-5 text-phoenix-teal" />
                  </div>
                  <Input 
                    id="origin"
                    placeholder="Enter starting point"
                    className="rounded-l-none"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="flex">
                  <div className="bg-muted p-2 rounded-l-md border border-r-0">
                    <MapPin className="h-5 w-5 text-phoenix-red" />
                  </div>
                  <Input 
                    id="destination"
                    placeholder="Enter destination"
                    className="rounded-l-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={handleFindRoute}
                className="bg-phoenix-blue hover:bg-phoenix-blue/90 px-8"
              >
                Find Safe Route
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isRouteFound && (
        <Tabs defaultValue="safest">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="safest" className="text-sm">Safest Route</TabsTrigger>
            <TabsTrigger value="fastest" className="text-sm">Fastest Route</TabsTrigger>
            <TabsTrigger value="balanced" className="text-sm">Balanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="safest" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <span className="font-medium">Safest Route</span>
                    <span className="ml-2 text-sm text-gray-500">35 min</span>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">
                      High Safety
                    </span>
                  </div>
                </div>
                
                <div className="relative pl-6 border-l-2 border-dashed border-phoenix-teal pt-2 pb-6">
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-6 w-6 rounded-full bg-phoenix-teal flex items-center justify-center">
                      <span className="text-white text-xs">A</span>
                    </div>
                  </div>
                  <p className="text-sm mb-1 font-medium">{origin || "Starting Point"}</p>
                  <p className="text-xs text-gray-500">Well-lit main road</p>
                </div>
                
                <div className="relative pl-6 border-l-2 border-phoenix-teal pt-2 pb-6">
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-phoenix-cream border-2 border-phoenix-teal"></div>
                  </div>
                  <p className="text-sm mb-1 font-medium">Metro Station</p>
                  <p className="text-xs text-gray-500">Guarded, CCTV surveillance</p>
                </div>
                
                <div className="relative pl-6 pt-2">
                  <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-6 w-6 rounded-full bg-phoenix-red flex items-center justify-center">
                      <span className="text-white text-xs">B</span>
                    </div>
                  </div>
                  <p className="text-sm mb-1 font-medium">{destination || "Destination"}</p>
                  <p className="text-xs text-gray-500">Commercial area</p>
                </div>
                
                <Alert className="mt-6 bg-blue-50">
                  <Info className="h-4 w-4 text-phoenix-blue" />
                  <AlertDescription className="text-sm text-phoenix-blue">
                    This route avoids isolated areas and follows well-lit streets with CCTV coverage.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6">
                  <Button className="w-full bg-phoenix-teal hover:bg-phoenix-teal/90">
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fastest" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Navigation className="h-5 w-5 text-phoenix-blue mr-2" />
                  <div>
                    <span className="font-medium">Fastest Route</span>
                    <span className="ml-2 text-sm text-gray-500">22 min</span>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                      Medium Safety
                    </span>
                  </div>
                </div>
                
                {/* Similar route details as above, shortened for brevity */}
                <Alert className="mt-6 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-700" />
                  <AlertDescription className="text-sm text-yellow-700">
                    This route includes some less monitored areas but is significantly faster.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6">
                  <Button className="w-full bg-phoenix-blue hover:bg-phoenix-blue/90">
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="balanced" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-phoenix-teal mr-2" />
                  <div>
                    <span className="font-medium">Balanced Route</span>
                    <span className="ml-2 text-sm text-gray-500">28 min</span>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                      Good Safety
                    </span>
                  </div>
                </div>
                
                {/* Similar route details as above, shortened for brevity */}
                <Alert className="mt-6 bg-blue-50">
                  <Info className="h-4 w-4 text-phoenix-blue" />
                  <AlertDescription className="text-sm text-phoenix-blue">
                    This route balances safety with travel time for an optimal journey.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6">
                  <Button className="w-full bg-phoenix-teal hover:bg-phoenix-teal/90">
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RoutesPage;
