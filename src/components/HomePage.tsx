
import React from 'react';
import { Shield, UserCheck, MapPin, Bell, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SosButton from './SosButton';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-phoenix-teal/90 to-phoenix-blue/90 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Phoenix Safety Guardian</h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto">
          Empowering women across India with AI-powered safety features
        </p>
        <div className="mt-8 flex justify-center">
          <SosButton />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-phoenix-blue mb-6 text-center">Safety Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Shield className="h-10 w-10 text-phoenix-red" />} 
            title="SOS Alert"
            description="One-tap emergency alert system that sends your location to trusted contacts"
            linkTo="/safety"
          />
          <FeatureCard 
            icon={<UserCheck className="h-10 w-10 text-phoenix-teal" />} 
            title="Trusted Contacts"
            description="Add and manage your emergency contacts for quick access"
            linkTo="/contacts"
          />
          <FeatureCard 
            icon={<MapPin className="h-10 w-10 text-phoenix-blue" />} 
            title="Safe Routes"
            description="Get suggestions for safer routes based on real-time data"
            linkTo="/routes"
          />
          <FeatureCard 
            icon={<Bell className="h-10 w-10 text-phoenix-lightblue" />} 
            title="Stealth Mode"
            description="Activate distress signal discreetly without alerting others"
            linkTo="/safety"
          />
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-md mb-12">
        <h2 className="text-2xl font-bold text-phoenix-blue mb-4 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-phoenix-cream rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-phoenix-teal">1</span>
            </div>
            <h3 className="font-semibold mb-2">Set Up Your Profile</h3>
            <p className="text-gray-600">Create your account and add emergency contacts</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-phoenix-cream rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-phoenix-teal">2</span>
            </div>
            <h3 className="font-semibold mb-2">Enable Permissions</h3>
            <p className="text-gray-600">Grant location access for accurate safety features</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-phoenix-cream rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-phoenix-teal">3</span>
            </div>
            <h3 className="font-semibold mb-2">Stay Protected</h3>
            <p className="text-gray-600">Use SOS or stealth mode in emergency situations</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl overflow-hidden shadow-lg mb-12">
        <div className="bg-phoenix-blue p-8 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-6">
            <h2 className="text-2xl font-bold mb-3">Need Immediate Help?</h2>
            <p className="mb-4">Contact women helpline or emergency services</p>
            <div className="flex space-x-4">
              <Button variant="secondary" size="lg" className="flex items-center space-x-2">
                <PhoneCall size={16} />
                <span>Call 1090</span>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-phoenix-blue flex items-center space-x-2">
                <PhoneCall size={16} />
                <span>Call 112</span>
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Shield className="h-24 w-24 text-phoenix-cream opacity-80" />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, linkTo }) => {
  return (
    <Link to={linkTo}>
      <Card className="feature-card h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-phoenix-blue mb-2">{title}</h3>
        <p className="text-gray-600 text-center">{description}</p>
      </Card>
    </Link>
  );
};

export default HomePage;
