
import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SosButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSosPress = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    setShowDialog(true);
    startCountdown();
  };

  const startCountdown = () => {
    let count = 5;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(interval);
        triggerSosAlert();
      }
    }, 1000);
    
    // Store interval ID to clear it if canceled
    window.sosCountdownInterval = interval;
  };

  const cancelSos = () => {
    if (window.sosCountdownInterval) {
      clearInterval(window.sosCountdownInterval);
    }
    setShowDialog(false);
    toast.info('SOS alert canceled');
  };

  const triggerSosAlert = () => {
    setShowDialog(false);
    toast.error('SOS Alert triggered! Location shared with your emergency contacts.', {
      duration: 5000,
    });
    // In a real app, this would:
    // 1. Get user's current location
    // 2. Send alerts to emergency contacts
    // 3. Potentially contact nearby authorities
  };

  return (
    <>
      <button 
        className={`sos-button ${isPressed ? 'scale-95' : ''}`}
        onClick={handleSosPress}
        aria-label="Emergency SOS Button"
      >
        <div className="sos-ripple"></div>
        <div className="sos-ripple" style={{ animationDelay: '0.5s' }}></div>
        <AlertOctagon className="h-10 w-10" />
        <span className="sr-only">SOS</span>
      </button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-phoenix-red flex items-center">
              <AlertOctagon className="mr-2" /> Emergency SOS Alert
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-center mb-4">
              SOS alert will be sent in {countdown} seconds
            </p>
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-phoenix-red/10 flex items-center justify-center border-4 border-phoenix-red text-3xl font-bold text-phoenix-red">
                {countdown}
              </div>
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Your location will be shared with your emergency contacts
            </p>
          </div>
          <DialogFooter>
            <Button onClick={cancelSos} variant="outline" className="w-full">
              Cancel
            </Button>
            <Button onClick={triggerSosAlert} variant="destructive" className="w-full">
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Add the interval type to the Window interface
declare global {
  interface Window {
    sosCountdownInterval: number | null;
  }
}

// Initialize the property
window.sosCountdownInterval = null;

export default SosButton;
