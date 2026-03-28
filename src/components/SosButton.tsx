
import React, { useEffect, useRef, useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getWhatsAppStatus, sendLocation, sendSOS } from '@/lib/api';

const SosButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const hasShownLocationErrorRef = useRef(false);
  const defaultUserName = 'Phoenix User';

  const clearCountdown = () => {
    if (window.sosCountdownInterval) {
      clearInterval(window.sosCountdownInterval);
      window.sosCountdownInterval = null;
    }
  };

  const getGeoErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Allow location access and try again.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable right now. Try again in a moment.';
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.';
      default:
        return 'Unable to fetch your current location for SOS alert';
    }
  };

  const handleSosPress = () => {
    if (isSendingSOS) {
      return;
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    setShowDialog(true);
    startCountdown();
  };

  const startCountdown = () => {
    clearCountdown();

    let count = 5;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearCountdown();
        triggerSosAlert();
      }
    }, 1000);
    
    // Store interval ID to clear it if canceled
    window.sosCountdownInterval = interval;
  };

  const cancelSos = () => {
    clearCountdown();
    setShowDialog(false);
    toast.info('SOS alert canceled');
  };

  const startLiveLocationTracking = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported in this browser');
      return;
    }

    // Avoid creating duplicate location watchers.
    if (watchIdRef.current !== null) {
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await sendLocation({
            user_name: defaultUserName,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          hasShownLocationErrorRef.current = false;
        } catch (error) {
          if (!hasShownLocationErrorRef.current) {
            const message = error instanceof Error ? error.message : 'Failed to send location update';
            toast.error(message);
            hasShownLocationErrorRef.current = true;
          }
        }
      },
      (error) => {
        if (!hasShownLocationErrorRef.current) {
          toast.error(getGeoErrorMessage(error));
          hasShownLocationErrorRef.current = true;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  };

  const triggerSosAlert = () => {
    clearCountdown();

    if (isSendingSOS) {
      return;
    }

    setIsSendingSOS(true);
    setShowDialog(false);

    void (async () => {
      try {
        const whatsappStatus = await getWhatsAppStatus();

        if (!whatsappStatus.configured) {
          toast.error(whatsappStatus.detail);
          setIsSendingSOS(false);
          return;
        }

        if (whatsappStatus.valid_contacts === 0) {
          toast.error(whatsappStatus.detail);
          setIsSendingSOS(false);
          return;
        }

        if (!('geolocation' in navigator)) {
          toast.error('Geolocation is not supported in this browser');
          setIsSendingSOS(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const sosResponse = await sendSOS({
                user_name: defaultUserName,
                latitude,
                longitude,
              });

              if (sosResponse.whatsapp.notifications_sent > 0) {
                toast.success(`SOS alert sent to ${sosResponse.whatsapp.notifications_sent} emergency contact(s).`, {
                  duration: 5000,
                });
              } else {
                toast.error(sosResponse.whatsapp.detail ?? 'SOS was saved, but WhatsApp message was not sent.');
              }

              startLiveLocationTracking();
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to send SOS alert';
              toast.error(message);
            } finally {
              setIsSendingSOS(false);
            }
          },
          (error) => {
            toast.error(getGeoErrorMessage(error));
            setIsSendingSOS(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 10000,
          }
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to verify WhatsApp status';
        toast.error(message);
        setIsSendingSOS(false);
      }
    })();
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (window.sosCountdownInterval) {
        clearCountdown();
      }
    };
  }, []);

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
            <Button onClick={triggerSosAlert} variant="destructive" className="w-full" disabled={isSendingSOS}>
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
